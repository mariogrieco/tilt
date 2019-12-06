import React, {Component} from 'react';
import {Text, TouchableOpacity, Platform, FlatList} from 'react-native';
// import PropTypes from 'prop-types'
import {connect} from 'react-redux';
// import {NavigationActions} from 'react-navigation';
// // import moment from 'moment';
import GoBack from '../components/GoBack';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
import isEqual from 'lodash/isEqual';
import ChannelDisplayName from '../components/ChannelDisplayName';
import getAllChannels from '../selectors/getAllChannels';

import {getPageForAllTab} from '../actions/tab_channels_actions';
import {getChannelStatsByGroup} from '../actions/channels';

// import styles from './styles';

export class AllChannels extends Component {
  state = {
    loading: false,
  };

  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'All Channels',
    headerLeft: <GoBack onPress={() => navigation.goBack()} />,
    headerRight: (
      // eslint-disable-next-line react-native/no-inline-styles
      <TouchableOpacity
        activeOpacity={1}
        style={{paddingHorizontal: 15, paddingVertical: 13}}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: 'SFProDisplay-Bold',
            fontSize: 16,
            letterSpacing: 0.1,
            color: '#17C491',
          }}
        />
      </TouchableOpacity>
    ),
    ...headerForScreenWithBottomLine({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
    headerTitleStyle: {
      fontSize: 18,
      marginTop: 10,
      marginBottom: 10,
      fontFamily: 'SFProDisplay-Bold',
    },
  });

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  keyExtractor(channel) {
    return channel.id;
  }

  componentDidMount() {
    this.props.getChannelStatsByGroup();
  }

  _fetchMore = ({distanceFromEnd}) => {
    if (distanceFromEnd <= 0) {
      if (this.state.loading) {
        return null;
      }
      this.setState(
        {
          loading: true,
        },
        async () => {
          try {
            const {channels} = this.props;
            await this.props.getPageForAllTab(channels.map(c => c.id));
            this.props.getChannelStatsByGroup();
          } catch (err) {
            console.log(err);
          } finally {
            this.setState({
              loading: false,
            });
          }
        },
      );
    }
  };

  renderItem = ({item}) => {
    const {channelStatsGroup} = this.props;
    return (
      <ChannelDisplayName
        channel={item}
        fav={item.fav}
        members={channelStatsGroup[item.id] || 0}
        name={item.name}
        create_at={item.create_at}
        key={item.id}
        channel_id={item.id}
        titleColor={item.titleColor}
        unreadMessagesCount={item.unreadMessagesCount}
        join={item.join}
        content_type={item.content_type}
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
        // ListEmptyComponent={this.renderActivityIndicator}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  }
}

const mapStateToProps = state => ({
  channels: getAllChannels(
    state,
    c => c.content_type === 'N' && c.type === 'O',
  ),
  theme: state.themes[state.themes.current],
  isAuth: state.login.isLogin,
  channelStatsGroup: state.channelStatsGroup,
});

const mapDispatchToProps = {
  getPageForAllTab,
  getChannelStatsByGroup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AllChannels);
