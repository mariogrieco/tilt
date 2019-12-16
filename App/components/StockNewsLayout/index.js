import React, {Component} from 'react';
import {FlatList, Platform, ActivityIndicator} from 'react-native';
import NavigationService from '../../config/NavigationService';
import {getNewsForSymbol} from '../../actions/newsActions';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';
import Separator from '../Separator';
import News from '../News';

export class StockNewsLayout extends Component {
  state = {
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentDidMount() {
    if (this.state.loading) {
      return false;
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({loading: true}, async () => {
      try {
        await this._fetchSomeNewsForSymbol();
      } catch (ex) {
        console.log(ex);
      } finally {
        this.setState({loading: false});
      }
    });
  }

  _fetchSomeNewsForSymbol() {
    const {selectedSymbol} = this.props;
    if (selectedSymbol) {
      console.log('here: ', selectedSymbol);
      return this.props.getNewsForSymbol(selectedSymbol);
    }
  }

  renderItem = ({item: {datetime, headline, image, source, url, related}}) => {
    return (
      <News
        datetime={datetime}
        headline={headline}
        image={image}
        source={source}
        onPress={this.handleOnNewPress.bind(this, url, related)}
      />
    );
  };

  handleOnNewPress(url, related) {
    NavigationService.navigate('WebView', {
      uri: url,
      title: related,
    });
  }

  keyExtractor(item, index) {
    return index;
  }

  render() {
    const {news, theme} = this.props;
    return (
      <FlatList
        extraData={news}
        data={news}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        initialNumToRender={50}
        onEndReachedThreshold={0}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={Separator}
        updateCellsBatchingPeriod={150}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
        ListEmptyComponent={<ActivityIndicator size="large" color="#17C491" />}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  }
}

const mapStateToProps = state => ({
  news: state.news[state.watchlist.selectedSymbol.symbol]
    ? state.news[state.watchlist.selectedSymbol.symbol]
    : [],
  selectedSymbol: state.watchlist.selectedSymbol.symbol,
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  getNewsForSymbol,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockNewsLayout);
