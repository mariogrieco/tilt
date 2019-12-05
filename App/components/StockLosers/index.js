import React, {Component} from 'react';
import {Platform, FlatList} from 'react-native';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {getStocksMarketLosersList} from '../../actions/StockTabActions';
import Separator from '../Separator';
import SymbolSummary from '../SymbolSummary';

export class StocksLosers extends Component {
  state = {
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  keyExtractor(channel) {
    return channel.symbol;
  }

  renderSeparator = () => {
    return <Separator />;
  };

  componentDidMount() {
    this.props.getStocksMarketLosersList();
  }

  filterIsNeeded() {
    let {searchValue, channels} = this.props;
    if (searchValue && !!searchValue.trim()) {
      searchValue = searchValue.toLowerCase();
      return channels.filter(channel => {
        if (!channel) return false;
        if (
          channel.symbol.toLowerCase().includes(searchValue) ||
          channel.companyName.toLowerCase().includes(searchValue)
        ) {
          return true;
        }
        return false;
      });
    }
    return channels.filter(channel => Boolean(channel));
  }

  renderItem = ({item}) => {
    return (
      <SymbolSummary
        onPress={() => this.props.onPress(item.symbol)}
        name={item.symbol}
        header={item.companyName}
        latest_price={item.latestPrice}
        change_percent={item.changePercent * 100}
      />
    );
  };

  render() {
    const {theme} = this.props;
    return (
      <FlatList
        extraData={this.filterIsNeeded()}
        data={this.filterIsNeeded()}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        initialNumToRender={50}
        onEndReachedThreshold={0}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={this.renderSeparator}
        updateCellsBatchingPeriod={150}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
        ListEmptyComponent={this.renderActivityIndicator}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  }
}

const mapStateToProps = state => ({
  channels: state.stockTab.losers,
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  getStocksMarketLosersList,
};

export default connect(mapStateToProps, mapDispatchToProps)(StocksLosers);
