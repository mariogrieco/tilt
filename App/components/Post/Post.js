import React from 'react';
import {
  View,
  Text,
  Image,
  // ImageBackground,
  TouchableOpacity,
} from 'react-native';
import RNUrlPreview from 'react-native-url-preview';
// import CurrentUserStatus from '../CurrentUserStatus'
import moment from 'moment';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import SponsoredAd from './SponsoredAd';
import {jumpToAction} from '../../actions/advancedSearch';
import {navigateIfExists} from '../../actions/channels';
import {removeReaction, addReaction} from '../../actions/reactions';
import {setCurrentDisplayUserProfile, onUser} from '../../actions/users';
import {showPostActions, showPostMediaBox} from '../../actions/posts';
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
import styles from './style';

const FILE_NOT_FOUND = require('../../../assets/images/file-not-found/file-not-found.png');
const TILT_SYSTEM_LOGO = require('../../../assets/images/tilt-logo/tilt-logo.png');

const sponsoredId = 'jk5osmydatgt5kaahkeheprk6e';

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

const MemoUrlPreview = React.memo(({text}) => (
  <View style={{height: 120, maxHeight: 120, marginBottom: 10}}>
    <RNUrlPreview
      text={text}
      containerStyle={styles.linkContainer}
      titleStyle={[styles.text, styles.mediumText]}
      descriptionStyle={styles.textLink}
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
    const {showPostActions, postId, userId, isReply, isPM} = this.props;
    showPostActions(userId, postId, {hideReply: isReply, isPM});
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
      name: show_name,
      create_at: channel.create_at,
      members: channel.members,
      fav: channel.fav,
      focusOn: postId,
      pm: isPm,
      isAdminCreator: channel.isDollar,
    });
  };

  renderFile(file) {
    // CLient4.getFilePublicLink(file.id).then(response => console.log(response))
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
              style={styles.imageContainer}
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
            style={styles.imageContainer}
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
        styles={styles.imageContainer}
        key={file.id}
      />
    );
  }

  renderFileComponent(files) {
    return files.map((file, index) => this.renderFile(file));
  }

  renderMessage = () => {
    const {
      message,
      metadata,
      edit_at,
      type,
      navigateIfExists,
      onUser,
      disableInteractions,
      isPM,
    } = this.props;
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
                onChannel={navigateIfExists}
                onUser={onUser}
                disableUserPattern={isPM}
              />
              <Text> </Text>
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
              style={styles.imageUrlContainer}
              source={{uri: `${imageUrl}`}}
            />
          </TouchableOpacity>
        )}
        {this.renderFileComponent(files)}
        {hasUrlForPreview && <MemoUrlPreview text={message.replace(imageUrl, ' ')} />}
      </>
    );
  };

  render() {
    const {
      // postId,
      username,
      // me,
      last_picture_update,
      metadata,
      createdAt,
      // usernames,
      // post,
      type,
      thread,
      replies,
      extendedDateFormat,
      // channelsNames,
      disableDots,
      userId,
      jumpTo,
      disableInteractions,
      sponsoredIds,
    } = this.props;
    const typeIsSystem = type.match('system');
    const reactions = reduceReactions(metadata);
    const isSponsoredUser = sponsoredIds.includes(userId);
    const profilePictureUrl = getUserProfilePicture(
      userId,
      last_picture_update,
    );
    return (
      <View style={styles.container}>
        {!typeIsSystem && !disableDots && (
          <View style={styles.dotContainer}>
            <TouchableOpacity
              style={[styles.dotContainer]}
              onPress={disableInteractions ? () => {} : this.onPostPress}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>
        )}
        {jumpTo && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.jumpContainer}
            onPress={disableInteractions ? () => {} : this.jumpTo}>
            <View>
              <Text
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
        <View style={styles.leftSideContainer}>
          <View>
            <Image
              style={[styles.profileImage, {resizeMode: 'cover'}]}
              source={
                typeIsSystem ? TILT_SYSTEM_LOGO : {uri: profilePictureUrl}
              }
            />
          </View>
          {thread && <View style={styles.threadSeparator} />}
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity
            onPress={
              disableInteractions || isSponsoredUser
                ? () => {}
                : this.handleNavigationToProfile
            }>
            <Text>
              <Text style={[styles.username]}>
                {typeIsSystem ? 'System' : username}{' '}
              </Text>
              <Text style={styles.timespan}>
                {extendedDateFormat
                  ? moment(createdAt).format('M/D/YY, h:mm A')
                  : moment(createdAt).format('h:mm A')}
              </Text>
            </Text>
          </TouchableOpacity>
          {isSponsoredUser ? <SponsoredAd /> : this.renderMessage()}
          <Reactions
            reactions={reactions}
            disableInteractions={disableInteractions}
            onLikes={this.onLikes}
            onDislike={this.onDislike}
            onLaughs={this.onLaughs}
            onSadFace={this.onSadFace}
            onRocket={this.onRocket}
            onEyes={this.onEyes}
            onReply={this.onReply}
            replies={replies}
          />
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
  me: state.login.user ? state.login.user.id : null,
  sponsoredIds: state.sponsored,
  users: state.users.data,
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
  // clearjumpToAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Post);
