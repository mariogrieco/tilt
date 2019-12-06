import React from 'react';
import {connect} from 'react-redux';
import {View, ActivityIndicator, FlatList, Text, Platform} from 'react-native';
import isEqual from 'lodash/isEqual';
import {withNavigation} from 'react-navigation';
// import Post from '../Post/Post';
// import NavigationService from '../../config/NavigationService';
import {getTeams} from '../../actions/teams';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import {getPostsByChannelId} from '../../actions/posts';
import {
  getProfilesInGroupChannels,
  getMyChannelMembers,
} from '../../actions/users';
import getChannelsList from '../../selectors/getChannelsList';
import {
  addToChannel,
  getChannels,
  getChannelStatsByGroup,
  getLastViewForChannels,
} from '../../actions/channels';
import {getFlagged} from '../../actions/flagged';
import ChannelDisplayName from '../ChannelDisplayName';

class Channels extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const {channels, isAuth} = props;
    const {membersFetched} = state;
    if (channels.length > 0 && !membersFetched && isAuth) {
      props.getChannelStatsByGroup(channels);
      return {membersFetched: true};
    }
    return null;
  }

  state = {
    unmount: false,
    loadingData: false,
    membersFetched: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
    this.setState({
      unmount: true,
    });
  }

  renderActivityIndicator = () => {
    const {loadingData} = this.state;
    const {isAuth} = this.props;
    if (loadingData && isAuth) {
      return (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}>
          <ActivityIndicator size="large" color="#17C491" />
        </View>
      );
    }
    return (
      <View>
        <Text />
      </View>
    );
  };

  keyExtractor(channel) {
    return channel.id;
  }

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
        initialNumToRender={8}
        ListEmptyComponent={this.renderActivityIndicator}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  }
}

const mapStateToProps = state => ({
  channels: getChannelsList(state),
  channelStatsGroup: state.channelStatsGroup,
  isAuth: state.login.isLogin,
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  setActiveFocusChannel,
  addToChannel,
  getChannels,
  getChannelStatsByGroup,
  getProfilesInGroupChannels,
  getPostsByChannelId,
  getLastViewForChannels,
  getFlagged,
  getMyChannelMembers,
  getTeams,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Channels),
);
