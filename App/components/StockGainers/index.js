import React, {Component} from 'react';
import {Platform, FlatList} from 'react-native';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import ChannelDisplayName from '../ChannelDisplayName';
import getAllChannels from '../../selectors/getAllChannels';

import {getPageForStocksTab} from '../../actions/tab_channels_actions';
import SymbolSummary from '../SymbolSummary';

// import styles from './styles';

export class StockGainers extends Component {
  state = {
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  keyExtractor(channel) {
    return channel.id;
  }

  _fetchMore = ({distanceFromEnd}) => {
    if (distanceFromEnd <= 0) {
      if (this.state.loading) return null;
      this.setState({
        loading: true
      }, () => {
        try {
          this.props.getPageForStocksTab([]);
        } catch (err) {
          console.log(err);
        } finally {
          this.setState({
            loading: false,
          })
        }
      })
    }
  };

  renderItem = ({item}) => {
    return (
      <SymbolSummary
        name={item.name}
        header={item.header}
        purpose={item.purpose}
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
        onEndReached={this._fetchMore}
        onEndReachedThreshold={0}
        maxToRenderPerBatch={5}
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
  channels: getAllChannels(state, channel => {
    return channel.content_type === 'S';
  }),
  theme: state.themes[state.themes.current],
  isAuth: state.login.isLogin,
  channelStatsGroup: state.channelStatsGroup,
});

const mapDispatchToProps = {
  getPageForStocksTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockGainers);
