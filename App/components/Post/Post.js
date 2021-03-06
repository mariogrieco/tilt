import React from 'react';
import {
  View,
  Text,
  Image,
  // ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNUrlPreview from 'react-native-url-preview';
import JoinButton from '../JoinButton';
import {deletePost} from '../../actions/posts';
import moment from 'moment';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import SponsoredAd from './SponsoredAd';
import {jumpToAction} from '../../actions/advancedSearch';
import {navigateIfExists} from '../../actions/channels';
import {removeReaction, addReaction} from '../../actions/reactions';
import {setCurrentDisplayUserProfile, onUser} from '../../actions/users';
import {showPostActions, showPostMediaBox} from '../../actions/posts';
import {setPopupSymbolValue} from '../../actions/chartPopup';
import {getBaseUrl} from '../../api/MattermostClient';
import NavigationService from '../../config/NavigationService';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import {
  setActiveThreadData,
  setActiveFocusChannel,
} from '../../actions/AppNavigation';
import PureParsedText from './PureParsedText';
import {isVideo, isDocument, isImage} from '../Input/file_utils';
import DocumentSample from '../DocumentSample';
import VideoSample from '../VideoSample';
import parser from '../../utils/parse_display_name';
import Reactions from './Reactions';
import Repost from '../Repost';
import {getRepostIfneeded} from '../../selectors/getRepostIfneeded';
import {getReportIfNeeded} from '../../selectors/getReportIfNeeded';
import {addToChannel} from '../../actions/channels';
import styles from './style';

const FILE_NOT_FOUND = require('../../../assets/themes/light/file-not-found/file-not-found.png');
const TILT_SYSTEM_LOGO = require('../../../assets/themes/light/tilt-logo/tilt-logo.png');

function reduceReactions(metadata) {
  let likes = 0;
  let dislikes = 0;
  let laughs = 0;
  let rocket = 0;
  let sadFace = 0;
  let eyes = 0;

  if (metadata && metadata.reactions) {
    metadata.reactions.forEach(({emoji_name}) => {
      if (emoji_name === '+1') {
        ++likes;
      }
      if (emoji_name === '-1') {
        ++dislikes;
      }
      if (emoji_name === 'joy') {
        ++laughs;
      }
      if (emoji_name === 'rocket') {
        ++rocket;
      }
      if (emoji_name === 'frowning_face') {
        ++sadFace;
      }
      if (emoji_name === 'eyes') {
        ++eyes;
      }
    });
  }
  return {
    likes,
    dislikes,
    laughs,
    rocket,
    sadFace,
    eyes,
  };
}

const MemoUrlPreview = React.memo(({text, theme}) => (
  <View style={{height: 120, maxHeight: 120, marginBottom: 10}}>
    <RNUrlPreview
      text={text}
      containerStyle={[
        styles.linkContainer,
        {borderColor: theme.borderBottomColor},
      ]}
      titleStyle={[
        styles.text,
        styles.mediumText,
        {color: theme.primaryTextColor},
      ]}
      descriptionStyle={[styles.textLink, {color: theme.placeholderTextColor}]}
    />
  </View>
));

class Post extends React.Component {
  state = {
    loadingLike: false,
    loadingEye: false,
    loadingRocket: false,
    loadingLaughts: false,
    loadingSadFace: false,
    loadingDislike: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  onDislike = () => {
    if (this.state.loadingDislike) {
      return null;
    }
    const reactions = this.getReactions();
    this.setState(
      {
        loadingDislike: true,
      },
      async () => {
        try {
          const {postId, me} = this.props;
          if (this.findEmojiName('-1')) {
            await this.props.removeReaction(me, postId, '-1');
          } else {
            await this.props.addReaction(me, postId, '-1');
          }
        } catch (ex) {
          alert(ex);
        } finally {
          setTimeout(() => {
            this.setState({
              loadingDislike: false,
            });
          }, 0);
        }
      },
    );
  };

  onEyes = () => {
    if (this.state.loadingEye) {
      return null;
    }
    this.setState(
      {
        loadingEye: true,
      },
      async () => {
        try {
          const {postId, me} = this.props;
          if (this.findEmojiName('eyes')) {
            await this.props.removeReaction(me, postId, 'eyes');
          } else {
            await this.props.addReaction(me, postId, 'eyes');
          }
        } catch (ex) {
          alert(ex);
        } finally {
          setTimeout(() => {
            this.setState({
              loadingEye: false,
            });
          }, 0);
        }
      },
    );
  };

  onRocket = () => {
    if (this.state.loadingRocket) {
      return null;
    }
    this.setState(
      {
        loadingRocket: true,
      },
      async () => {
        try {
          const {postId, me} = this.props;
          if (this.findEmojiName('rocket')) {
            await this.props.removeReaction(me, postId, 'rocket');
          } else {
            await this.props.addReaction(me, postId, 'rocket');
          }
        } catch (ex) {
          alert(ex);
        } finally {
          setTimeout(() => {
            this.setState({
              loadingRocket: false,
            });
          }, 0);
        }
      },
    );
  };

  onLaughs = () => {
    if (this.state.loadingLaughts) {
      return null;
    }
    this.setState(
      {
        loadingLaughts: true,
      },
      async () => {
        try {
          const {postId, me} = this.props;
          if (this.findEmojiName('joy')) {
            await this.props.removeReaction(me, postId, 'joy');
          } else {
            await this.props.addReaction(me, postId, 'joy');
          }
        } catch (ex) {
          alert(ex);
        } finally {
          setTimeout(() => {
            this.setState({
              loadingLaughts: false,
            });
          }, 0);
        }
      },
    );
  };

  onSadFace = () => {
    if (this.state.loadingSadFace) {
      return null;
    }
    this.setState(
      {
        loadingSadFace: true,
      },
      async () => {
        try {
          const {postId, me} = this.props;
          if (this.findEmojiName('frowning_face')) {
            await this.props.removeReaction(me, postId, 'frowning_face');
          } else {
            await this.props.addReaction(me, postId, 'frowning_face');
          }
        } catch (ex) {
          alert(ex);
        } finally {
          setTimeout(() => {
            this.setState({
              loadingSadFace: false,
            });
          }, 0);
        }
      },
    );
  };

  onLikes = () => {
    if (this.state.loadingLike) {
      return null;
    }
    this.setState(
      {
        loadingLike: true,
      },
      async () => {
        try {
          const {postId, me} = this.props;
          if (this.findEmojiName('+1')) {
            await this.props.removeReaction(me, postId, '+1');
          } else {
            await this.props.addReaction(me, postId, '+1');
          }
        } catch (ex) {
          alert(ex);
        } finally {
          setTimeout(() => {
            this.setState({
              loadingLike: false,
            });
          }, 0);
        }
      },
    );
  };

  getReactions() {
    return this.props.metadata && this.props.metadata
      ? this.props.metadata.reactions
      : null;
  }

  handleNavigationToProfile = () => {
    const {showLoggedUserProfile, userId} = this.props;

    if (showLoggedUserProfile) {
      this.props.setCurrentDisplayUserProfile(userId);
      NavigationService.navigate('MemberProfile');
    }
  };

  onReply = () => {
    const {
      setActiveThreadData,
      postId,
      // isPM
    } = this.props;
    // if (isPM) return null;
    setActiveThreadData(postId);
    NavigationService.navigate('Thread');
  };

  findEmojiName = name => {
    const reactions = this.getReactions();
    const {me} = this.props;
    if (reactions) {
      return reactions.find(
        ({emoji_name, user_id}) => emoji_name == name && user_id === me,
      );
    }
    return null;
  };

  onPostPress = () => {
    const {
      postId,
      userId,
      isReply,
      isPM,
      allowRepost,
      repost,
      enablePostActions,
      showPreviewDots,
    } = this.props;
    this.props.showPostActions(userId, postId, {
      hideReply: isReply,
      isPM,
      showRepost: postId,
      showRepostNoRequieredRedirect:
        repost && !allowRepost ? repost.channel_id : null,
      enablePostActions,
      showPreviewDots,
    });
  };

  parseDisplayName(str = '') {
    return parser(str);
  }

  jumpTo = async () => {
    const {channel, postId, jumpToAction, me, users} = this.props;
    if (!channel) {
      return null;
    }
    this.props.setActiveFocusChannel(channel.id);
    const r = await jumpToAction(channel.id, postId, 0, 10);
    const isPm = channel.type === 'D';
    let show_name = channel.name;

    if (isPm) {
      show_name = show_name.replace(me, '').replace('__', '');
      show_name = users[show_name] ? users[show_name].username : '';
    }

    NavigationService.navigate('Channel', {
      title: parser(show_name),
      create_at: channel.create_at,
      members: channel.members,
      fav: channel.fav,
      focusOn: postId,
      pm: isPm,
      isAdminCreator: channel.isDollar,
    });
  };

  deletePost = async () => {
    const {deleteAction, postId} = this.props;
    const post_id = deleteAction.id;

    Alert.alert(
      '',
      'Are you going to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            await this.props.deletePost(post_id);
            await this.props.deletePost(postId);
          },
          style: 'default',
        },
      ],
      {cancelable: false},
    );
  };

  renderFile(file) {
    const {theme} = this.props;
    if (isImage(file)) {
      if (file.mime_type === 'image/gif') {
        return (
          <TouchableOpacity
            activeOpacity={1}
            key={file.id}
            onPress={() =>
              this.props.showPostMediaBox({
                uri: `${getBaseUrl()}/api/v4/files/${file.id}`,
                type: 'image',
                id: file.id,
              })
            }>
            <Image
              style={[
                styles.imageContainer,
                {borderColor: theme.borderBottomColor},
              ]}
              source={{uri: `${getBaseUrl()}/api/v4/files/${file.id}`}}
            />
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          activeOpacity={1}
          key={file.id}
          onPress={() =>
            this.props.showPostMediaBox({
              uri: `${getBaseUrl()}/api/v4/files/${file.id}/preview`,
              type: 'image',
              id: file.id,
            })
          }>
          <Image
            style={[
              styles.imageContainer,
              {borderColor: theme.borderBottomColor},
            ]}
            source={{uri: `${getBaseUrl()}/api/v4/files/${file.id}/preview`}}
          />
        </TouchableOpacity>
      );
    }

    if (isDocument(file)) {
      return (
        <DocumentSample
          name={file.name}
          size={file.size}
          extension={file.extension}
          uri={`${getBaseUrl()}/api/v4/files/${file.id}?download=1`}
          fileId={file.id}
          key={file.id}
        />
      );
    }

    if (isVideo(file)) {
      // return <VideoSample
      // uri={`${getBaseUrl()}/api/v4/files/${file.id}`}
      //   // uri={'https://community.tiltchat.com/api/v4/files/3nqy35r69bfcursph6gnaga3ue?download=0'}
      // />
      // return <View><Text>{`${getBaseUrl()}/api/v4/files/${file.id}`}</Text></View>
      return (
        <VideoSample key={file.id} file={file} extension={file.extension} />
      );
    }

    return (
      <Image
        source={FILE_NOT_FOUND}
        styles={[styles.imageContainer, {borderColor: theme.borderBottomColor}]}
        key={file.id}
      />
    );
  }

  renderFileComponent(files) {
    return files.map((file, index) => this.renderFile(file));
  }

  handleOnChannelChartMention = value => {
    this.props.setPopupSymbolValue(value, true);
  };

  renderMessage = () => {
    const {
      message,
      metadata,
      edit_at,
      type,
      onUser,
      disableInteractions,
      isPM,
      // reported,
      post_props,
    } = this.props;
    const {theme} = this.props;
    const typeIsSystem = type.match('system');

    const imageUrl =
      metadata && metadata.embeds && metadata.embeds[0].type === 'image'
        ? metadata.embeds[0].url
        : false;
    const files =
      metadata && metadata.files && metadata.files ? metadata.files : [];

    const REGEX = /(http(s?):\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})/gi;

    let hasUrlForPreview = false;

    if (imageUrl) {
      hasUrlForPreview = Boolean(
        message &&
          message.replace(imageUrl, ' ').match(REGEX) &&
          message.replace(imageUrl, ' ').match(REGEX)[0],
      );
    } else {
      hasUrlForPreview = Boolean(
        message && message.match(REGEX) && message.match(REGEX)[0],
      );
    }

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={disableInteractions ? () => {} : this.onReply}>
          {!imageUrl && (
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <PureParsedText
                message={message}
                typeIsSystem={typeIsSystem}
                onChannel={this.props.navigateIfExists}
                onChannel2={this.handleOnChannelChartMention}
                onUser={onUser}
                props={post_props}
                disableUserPattern={isPM}
                post_props={post_props}
              />
              {edit_at > 0 && <Text style={styles.edited}>(edited)</Text>}
            </View>
          )}
        </TouchableOpacity>
        {imageUrl && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              this.props.showPostMediaBox({uri: imageUrl, type: 'image'})
            }>
            <Image
              style={[
                styles.imageUrlContainer,
                {borderColor: theme.borderBottomColor},
              ]}
              source={{uri: `${imageUrl}`}}
            />
          </TouchableOpacity>
        )}
        {this.renderFileComponent(files)}
        {hasUrlForPreview && (
          <MemoUrlPreview text={message.replace(imageUrl, ' ')} theme={theme} />
        )}
      </>
    );
  };

  renderDelteText() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.jumpContainer}
        onPress={this.deletePost}>
        <View>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color: '#fc3e30',
              fontFamily: 'SFProDisplay-Medium',
              fontSize: 16,
              letterSpacing: 0.1,
            }}>
            Delete
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      username,
      last_picture_update,
      metadata,
      createdAt,
      type,
      thread,
      replies,
      extendedDateFormat,
      disableDots,
      userId,
      jumpTo,
      disableInteractions,
      sponsoredIds,
      isRepost,
      repost,
      reported,
      deleteAction,
      isAdminUser,
      postId,
      theme,
      postedChannelName,
      displayJoinButton,
      channelId,
      enablePostActions,
      usernameComponent,
      userPictureComponent,
      showPreviewDots,
    } = this.props;
    const typeIsSystem = type.match('system');
    const reactions = reduceReactions(metadata);
    const isSponsoredUser = sponsoredIds.includes(userId);
    const profilePictureUrl = getUserProfilePicture(
      userId,
      last_picture_update,
    );

    return (
      <View style={[isRepost ? styles.repostContainer : styles.container]}>
        <View style={styles.dotJoinContainer}>
          {displayJoinButton && (
            // eslint-disable-next-line react-native/no-inline-styles
            <JoinButton channelId={channelId} buttonStyle={{marginRight: 5}} />
          )}

          {((!typeIsSystem && !disableDots && !isRepost) ||
            showPreviewDots) && (
            <TouchableOpacity
              style={[styles.dotContainer]}
              onPress={
                disableInteractions && !showPreviewDots
                  ? () => {}
                  : this.onPostPress
              }>
              <View
                style={[styles.dot, {backgroundColor: theme.primaryTextColor}]}
              />
              <View
                style={[styles.dot, {backgroundColor: theme.primaryTextColor}]}
              />
              <View
                style={[styles.dot, {backgroundColor: theme.primaryTextColor}]}
              />
            </TouchableOpacity>
          )}
        </View>
        {deleteAction && isAdminUser && this.renderDelteText()}
        {jumpTo && !isRepost && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.jumpContainer}
            onPress={disableInteractions ? () => {} : this.jumpTo}>
            <View>
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  color: '#17C491',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 16,
                  letterSpacing: 0.1,
                }}>
                Jump
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {!isRepost && (
          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              onPress={
                disableInteractions || isSponsoredUser
                  ? () => {}
                  : this.handleNavigationToProfile
              }>
              {userPictureComponent ? (
                userPictureComponent({
                  style: [styles.profileImage, {resizeMode: 'cover'}],
                })
              ) : (
                <Image
                  style={[styles.profileImage, {resizeMode: 'cover'}]}
                  source={
                    typeIsSystem ? TILT_SYSTEM_LOGO : {uri: profilePictureUrl}
                  }
                />
              )}
            </TouchableOpacity>
            {thread && (
              <View
                style={[
                  styles.threadSeparator,
                  {backgroundColor: theme.threadSeparatorColor},
                ]}
              />
            )}
          </View>
        )}
        <View style={isRepost ? {} : styles.usernameAndPostContent}>
          {!isRepost && (
            <View>
              {postedChannelName ? (
                <PureParsedText
                  message={postedChannelName}
                  typeIsSystem={false}
                  onChannel={this.props.navigateIfExists}
                />
              ) : null}
              {usernameComponent ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {usernameComponent()}
                  <Text
                    style={[styles.timespan, {flex: 1, textAlign: 'right'}]}>
                    {moment(createdAt).format('M/D/YY, h:mm A')}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={
                    disableInteractions || isSponsoredUser
                      ? () => {}
                      : this.handleNavigationToProfile
                  }>
                  <Text>
                    <Text
                      style={[
                        styles.username,
                        {color: theme.primaryTextColor},
                      ]}>
                      {typeIsSystem ? 'System' : username}{' '}
                    </Text>
                    <Text style={styles.timespan}>
                      {extendedDateFormat
                        ? moment(createdAt).format('MMM D, h:mm A')
                        : moment(createdAt).format('h:mm A')}
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {isRepost && (
            <View style={styles.repostProfileImageAndUsername}>
              <TouchableOpacity
                onPress={
                  disableInteractions || isSponsoredUser
                    ? () => {}
                    : this.handleNavigationToProfile
                }>
                <Image
                  style={[
                    styles.repostProfileImage,
                    {resizeMode: 'cover', marginRight: 10},
                  ]}
                  source={
                    typeIsSystem ? TILT_SYSTEM_LOGO : {uri: profilePictureUrl}
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  disableInteractions || isSponsoredUser
                    ? () => {}
                    : this.handleNavigationToProfile
                }>
                <Text>
                  <Text
                    style={[styles.username, {color: theme.primaryTextColor}]}>
                    {typeIsSystem ? 'System' : username}{' '}
                  </Text>
                  <Text style={styles.timespan}>
                    {extendedDateFormat
                      ? moment(createdAt).format('MMM D, h:mm A')
                      : moment(createdAt).format('h:mm A')}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {isSponsoredUser ? (
            <SponsoredAd isRepost={isRepost} />
          ) : (
            this.renderMessage()
          )}
          {repost && !isRepost && (
            <Repost
              postId={postId}
              message={repost.message}
              metadata={repost.metadata}
              deleteAction={reported}
              create_at={repost.create_at}
              replies={repost.replies}
              edit_at={repost.edit_at}
              type={repost.type}
              userId={repost.user.id}
              last_picture_update={repost.user.last_picture_update}
              username={repost.user.username}
              post_props={repost.props}
            />
          )}
          {!isRepost && (
            <Reactions
              reactions={reactions}
              disableInteractions={disableInteractions || !enablePostActions}
              onLikes={this.onLikes}
              onDislike={this.onDislike}
              onLaughs={this.onLaughs}
              onSadFace={this.onSadFace}
              onRocket={this.onRocket}
              onEyes={this.onEyes}
              onReply={this.onReply}
              replies={replies}
            />
          )}
        </View>
      </View>
    );
  }
}

Post.defaultProps = {
  extendedDateFormat: false,
  showLoggedUserProfile: true,
  isReply: false,
  disableInteractions: false,
  disableDots: false,
};

const mapStateToProps = (state, props) => ({
  loggedUser: state.login.user ? state.login.user.username : '',
  isAdminUser: state.login.user
    ? state.login.user.roles.includes('admin')
    : false,
  me: state.login.user ? state.login.user.id : null,
  sponsoredIds: state.sponsored,
  users: state.users.data,
  repost: getRepostIfneeded(state, props.postId),
  reported: getReportIfNeeded(state, props.postId),
  theme: state.themes[state.themes.current],
  enablePostActions: Boolean(
    state.myChannelsMap.get(props.channelId) ||
      state.myChannelsMap.get(state.appNavigation.active_channel_id) ||
      state.myChannelsMap.get(
        state.posts.entities[props.postId]
          ? state.posts.entities[props.postId].channel_id
          : null,
      ),
  ),
});

const mapDispatchToProps = {
  removeReaction,
  addReaction,
  setActiveThreadData,
  setCurrentDisplayUserProfile,
  showPostActions,
  navigateIfExists,
  onUser,
  setActiveFocusChannel,
  jumpToAction,
  showPostMediaBox,
  deletePost,
  setPopupSymbolValue,
  addToChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Post);
