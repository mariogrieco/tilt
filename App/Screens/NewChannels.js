import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  Platform,
  FlatList,
  ActivityIndicator,
} from 'react-native';
// import PropTypes from 'prop-types'
import {connect} from 'react-redux';
// import {NavigationActions} from 'react-navigation';
// // import moment from 'moment';
import GoBack from '../components/GoBack';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
import isEqual from 'lodash/isEqual';
import ChannelDisplayName from '../components/ChannelDisplayName';
import getAllChannels from '../selectors/getAllChannels';
import {getChannelStatsByGroup} from '../actions/channels';

import {getPageForNewTab} from '../actions/tab_channels_actions';
import moment from 'moment';

// import styles from './styles';

export class AllChannels extends Component {
  state = {
    loading: false,
  };

  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'New Channels',
    headerLeft: <GoBack onPress={() => navigation.goBack()} />,
    headerRight: (
      // eslint-disable-next-line react-native/no-inline-styles
      <TouchableOpacity style={{paddingHorizontal: 15, paddingVertical: 13}}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: 'SFProDisplay-Bold',
            fontSize: 16,
            letterSpacing: 0.1,
            color: '#17C491',
          }}>
        </Text>
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

  componentDidMount() {
    this._fetchMore({distanceFromEnd: 0});
    this.props.getChannelStatsByGroup();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  keyExtractor(channel) {
    return channel.id;
  }

  _fetchMore = ({distanceFromEnd}) => {
    if (distanceFromEnd >= 0) {
      if (this.state.loading) return null;
      this.setState({
        loading: true
      }, async () => {
        try {
          const {channels} = this.props; 
          await this.props.getPageForNewTab(channels.map(c => c.id));
          this.props.getChannelStatsByGroup();
        } catch (err) {
          console.log(err);
        } finally {
          this.setState({
            loading: false,
          })
        }
      });
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
        onEndReachedThreshold={0.25}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={150}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 0.25}}
        ListEmptyComponent={this.renderActivityIndicator}
        ListFooterComponent={
          this.state.loading ? (
            <ActivityIndicator margin={30} size="large" color="#17C491" />
          ) : null
        }
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
    ({create_at}) => moment(create_at).diff(moment(), 'days') >= -3,
  ),
  theme: state.themes[state.themes.current],
  isAuth: state.login.isLogin,
  channelStatsGroup: state.channelStatsGroup,
});

const mapDispatchToProps = {
  getPageForNewTab,
  getChannelStatsByGroup,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AllChannels);
