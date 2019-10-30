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
  getMyChannels,
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

  // eslint-disable-next-line no-underscore-dangle
  _getData() {
    // if (!this.props.isAuth) return null;
    // if (this.state.loadingData) return null;
    // this.setState({
    //   loadingData: true
    // }, async () => {
    // try {
    //   await this.props.getTeams();
    //   await this.props.getMyChannels();
    //   const asyncFetchs = [];
    //   const myChannels = await this.props.myChannels;
    //   asyncFetchs.push(this.props.getLastViewForChannels());
    //   asyncFetchs.push(this.props.getChannels());
    //   asyncFetchs.push(this.props.getPostsByChannelId(myChannels));
    //   // asyncFetchs.push(this.props.getMyChannelMembers())
    //   await Promise.all(asyncFetchs);
    //   await this.props.getProfilesInGroupChannels();
    //   await this.props.getFlagged();
    // } catch (ex) {
    //   alert(ex.message || ex);
    // } finally {
    //   if (!this.state.unmount) {
    // this.setState({
    //   loadingData: false
    // });
    // }
    // }
    // });
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
      />
    );
  };

  render() {
    const {channels} = this.props;
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
      />
    );
  }
}

const mapStateToProps = state => ({
  channels: getChannelsList(state),
  channelStatsGroup: state.channelStatsGroup,
  isAuth: state.login.isLogin,
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
  getMyChannels,
  getTeams,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Channels),
);
