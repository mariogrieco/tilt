import React, {Component} from 'react';
import {Platform, FlatList} from 'react-native';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {getStocksMarketMostactiveList} from '../../actions/StockTabActions';
import Separator from '../Separator';
import SymbolSummary from '../SymbolSummary';

export class StocksActive extends Component {
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
    this.props.getStocksMarketMostactiveList();
  }

  renderItem = ({item}) => {
    return (
      <SymbolSummary
        onPress={() => this.props.onPress(item.symbol)}
        name={item.symbol}
        header={item.companyName}
        latest_price={item.latestPrice}
        change_percent={item.changePercent}
      />
    );
  };

  render() {
    const {channels, theme} = this.props;
    return (
      <FlatList
        extraData={channels}
        data={channels}
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
  channels: state.stockTab.actives,
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  getStocksMarketMostactiveList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StocksActive);
