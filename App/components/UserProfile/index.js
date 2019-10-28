import React from 'react';
import {View, FlatList, Text, Image, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import Post from '../Post/Post';
import {getAllPostByUserId} from '../../selectors/getUserById';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import {getChannelDisplayNameAsDictionary} from '../../selectors/getChannelNames';
import {createDirectChannel} from '../../actions/channels';
import ReactionSummary from '../ReactionSummary';
import PostsSummary from '../PostsSummary';
import styles from './styles';

const MESSAGE = require('../../../assets/images/profile-envelope/profile-envelope.png');
const LANDER = require('../../../assets/images/lunar-module/lunar-module.png');

export const Header = ({
  firstName,
  lastName,
  username,
  description,
  imageUrl,
  isSelfProfile,
  createDirectChannel,
  userId,
}) => (
  <View style={styles.headerContainer}>
    <View style={{flexDirection: 'row', marginBottom: 15}}>
      <View style={{}}>
        <Image
          source={{uri: imageUrl}}
          style={{width: 80, height: 80, borderRadius: 40}}
        />
        {firstName || lastName ? (
          <Text style={styles.userNames}>{`${firstName} ${lastName}`}</Text>
        ) : (
          <Text />
        )}
        <Text style={styles.userNickName}>{`@${username}`}</Text>
      </View>
      {!isSelfProfile && (
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={createDirectChannel}
              style={styles.headerIcon}>
              <Image source={MESSAGE} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
    <Text style={styles.description}>{description}</Text>
    <PostsSummary userId={userId} />
    <ReactionSummary userId={userId} />
  </View>
);

class UserProfile extends React.PureComponent {
  listEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={LANDER} />
      <Text style={styles.emptyText}>
        Welcome to Tilt. It’s time to radio back to Earth. Make your first post,
        then see it here.
      </Text>
    </View>
  );

  createDirectChannel = () => {
    const {user, createDirectChannel} = this.props;
    createDirectChannel(user.id);
  };

  listHeaderComponent = () => {
    const {user, isSelfProfile} = this.props;
    const pictureProfileUrl = getUserProfilePicture(
      user.id,
      user.last_picture_update,
    );
    return (
      <Header
        firstName={user ? user.first_name : ''}
        lastName={user ? user.last_name : ''}
        username={user ? user.username : ''}
        description={user.position}
        imageUrl={pictureProfileUrl}
        userId={user.id}
        isSelfProfile={isSelfProfile}
        createDirectChannel={this.createDirectChannel}
      />
    );
  };

  renderItem = ({item: post}) => {
    const {user, channelMentions, isSelfProfile} = this.props;

    const isHashtagChannel = channelMentions.hashtagChannels[post.channel_id]
      ? `#${channelMentions.hashtagChannels[post.channel_id]} `
      : '';

    const isDollarChannel = channelMentions.dollarChannels[post.channel_id]
      ? `$${channelMentions.dollarChannels[post.channel_id]} `
      : '';

    const inhiretChannelInMessage = `${isHashtagChannel ||
      isDollarChannel ||
      ''}${post.message}`;
    return (
      <View style={{paddingTop: 0, backgroundColor: '#fff'}}>
        <Post
          extendedDateFormat
          postId={post.id}
          userId={user ? user.id : ''}
          last_picture_update={user ? user.last_picture_update : ''}
          key={post.id}
          message={inhiretChannelInMessage}
          username={user ? user.username : ''}
          metadata={post.metadata}
          createdAt={post.create_at}
          type={post.type}
          replies={post.replies}
          edit_at={post.edit_at}
          showLoggedUserProfile={!isSelfProfile}
        />
      </View>
    );
  };

  render() {
    const {user, userPosts} = this.props;

    if (!user) {
      // Home redirection at the action
      return <View />;
    }

    return (
      <FlatList
        ref={ref => {
          this.listRef = ref;
        }}
        ListHeaderComponent={this.listHeaderComponent}
        ListEmptyComponent={this.listEmptyComponent}
        data={userPosts}
        extraData={userPosts}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        style={{flex: 1, backgroundColor: '#f6f7f9'}}
        initialNumToRender={50}
        removeClippedSubviews={Platform.OS === 'android'}
        updateCellsBatchingPeriod={150}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  let user = null;
  let isSelfProfile = false;

  if (state.login.user) {
    if (props.itsMe) {
      isSelfProfile = true;
    } else {
      isSelfProfile = state.login.user.id === state.users.currentUserIdProfile;
    }

    user = isSelfProfile
      ? state.login.user
      : state.users.data[state.users.currentUserIdProfile];
  }

  if (user) {
    const userPosts = getAllPostByUserId(state, user.id);
    const channelMentions = getChannelDisplayNameAsDictionary(state);

    return {
      user,
      userPosts,
      channelMentions,
      isSelfProfile,
    };
  }
  return {
    user: {},
    userPosts: [],
  };
};

const mapDispatchToProps = {
  createDirectChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);
