import React from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import Post from '../Post/Post';
import {getAllPostByUserId} from '../../selectors/getUserById';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import {getChannelDisplayNameAsDictionary} from '../../selectors/getChannelNames';
import {createDirectChannel} from '../../actions/channels';
import ReactionSummary from '../ReactionSummary';
import PostsSummary from '../PostsSummary';
import styles from './styles';
import assets from '../ThemeWrapper/assets';

const MESSAGE = require('../../../assets/themes/light/profile-envelope/profile-envelope.png');
const LANDER = require('../../../assets/themes/light/lunar-module/lunar-module.png');
const CALENDAR = require('../../../assets/themes/light/calendar/001-calendar-1.png');

export const Header = ({
  firstName,
  lastName,
  username,
  description,
  imageUrl,
  isSelfProfile,
  createDirectChannel,
  userId,
  createAt,
  theme,
}) => (
  <View
    style={[
      styles.headerContainer,
      {
        backgroundColor: theme.primaryBackgroundColor,
        borderBottomColor: theme.emojiReactionsBorderBackgroundColor,
      },
    ]}>
    <View style={{flexDirection: 'row', marginBottom: 15}}>
      <View style={{}}>
        <Image
          source={{uri: imageUrl}}
          style={{width: 80, height: 80, borderRadius: 8}}
        />
        {firstName || lastName ? (
          <Text
            style={[
              styles.userNames,
              {color: theme.primaryTextColor},
            ]}>{`${firstName} ${lastName}`}</Text>
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
    <Text style={[styles.description, {color: theme.primaryTextColor}]}>
      {description}
    </Text>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 11,
      }}>
      <Image source={CALENDAR} style={{marginRight: 5}} />
      <Text style={[styles.joinDate, {color: theme.secondaryTextColor}]}>
        Joined {moment(createAt).format('MMMM YYYY')}
      </Text>
    </View>
    <PostsSummary userId={userId} />
    <ReactionSummary userId={userId} />
  </View>
);

class UserProfile extends React.PureComponent {
  listEmptyComponent = () => {
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.emptyContainer,
          {backgroundColor: theme.secondaryBackgroundColor},
        ]}>
        <Image source={LANDER} />
        <Text style={[styles.emptyText, {color: theme.placeholderTextColor}]}>
          Welcome to Tilt. It’s time to radio back to Earth. Make your first
          post, then see it here.
        </Text>
      </View>
    );
  };

  createDirectChannel = () => {
    const {user, createDirectChannel} = this.props;
    createDirectChannel(user.id);
  };

  listHeaderComponent = () => {
    const {user, isSelfProfile, theme} = this.props;
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
        createAt={user.create_at}
        theme={theme}
      />
    );
  };

  renderItem = ({item: post}) => {
    const {user, channelMentions, isSelfProfile, theme} = this.props;

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
      <View style={{backgroundColor: theme.primaryBackgroundColor}}>
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
    const {user, userPosts, theme} = this.props;

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
        style={{flex: 1, backgroundColor: theme.secondaryBackgroundColor}}
        initialNumToRender={8}
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
      theme: state.themes[state.themes.current],
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
