import React from 'react';
import {View, Text, TouchableOpacity, Image, Clipboard} from 'react-native';
import Modal from 'react-native-modal';
import Dimensions from 'react-native-extra-dimensions-android';
import {connect} from 'react-redux';
import {addReaction} from '../../actions/reactions';
import Client4 from '../../api/MattermostClient';
import {
  deletePost,
  hidePostActions,
  resetPostActions,
} from '../../actions/posts';
import {reportPostById} from '../../actions/report';
import {setRepostActiveOnInput} from '../../actions/repost';
import {setFlagged, removeFlagged} from '../../actions/flagged';
import {addOrRemoveOne} from '../../actions/blockedUsers';
import {postReply} from '../../actions/reply';
import {
  setActiveThreadData,
  setActiveEditPostId,
} from '../../actions/AppNavigation';
import ReactionsGroup from '../ReactionsGroup';
import getPostById from '../../selectors/getPostById';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import NavigationService from '../../config/NavigationService';
import {navigateIfExists} from '../../actions/channels';
import {mod_user_id, tilt_user_id, moderator_user_id} from '../../globals';
import styles from './styles';

import assets from '../ThemeWrapper/assets';

const H = Dimensions.get('REAL_WINDOW_HEIGHT');
const W = Dimensions.get('REAL_WINDOW_WIDTH');

class PostBottomActions extends React.PureComponent {
  state = {
    loadingFlag: false,
    loadingDelete: false,
    hidePriority: false,
  };

  componentWillUnmount() {
    this.props.hidePostActions();
  }

  onEditMessage = () => {
    const {setActiveEditPostId, postActions} = this.props;
    setActiveEditPostId(postActions.postId);
    this.props.hidePostActions();
    NavigationService.navigate('ThreadEdit');
  };

  onDeleteMessage = () => {
    if (this.state.loadingDelete) {
      return null;
    }

    this.setState(
      {
        loadingDelete: true,
      },
      async () => {
        const {postActions} = this.props;
        try {
          await this.props.deletePost(postActions.postId);
          this.props.hidePostActions();
        } catch (ex) {
          alert(ex);
        } finally {
          this.setState({
            loadingDelete: false,
          });
        }
      },
    );
  };

  onReplyMessage = () => {
    const {
      dispatchPostReply,
      postActions,
      setActiveThreadData,
      postData,
    } = this.props;
    dispatchPostReply(postActions.postId, postActions.userId);
    setActiveThreadData(postActions.postId);
    this.props.hidePostActions();
    // setTimeout(() => {
    NavigationService.navigate('Thread');
    // }, 1000);
  };

  onFlagMessage = () => {
    if (this.state.loadingDelete) {
      return null;
    }

    this.setState(
      {
        loadingDelete: true,
      },
      async () => {
        try {
          const {postActions, setFlagged, me} = this.props;
          const r = await setFlagged(me, postActions.postId);
          this.props.hidePostActions();
          // alert('r');
          console.log(r);
        } catch (ex) {
          alert(ex);
        } finally {
          this.setState({
            loadingDelete: false,
          });
        }
      },
    );
  };

  onCopyLinkToMessage = () => {
    const {id} = this.props.postData;
    const str = Client4.getPostRoute(id);
    this._clipboard(str);
    this.props.hidePostActions();
  };

  _clipboard(str) {
    try {
      Clipboard.setString(str);
    } catch (er) {
      alert(er.message || er);
    }
  }

  onCopyTextMessage = () => {
    const {postData} = this.props;
    this._clipboard(postData.message);
    this.props.hidePostActions();
  };

  renderBottomSheetHeader = () => {
    const {postActions, hidePostActions} = this.props;
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.headerContainer,
          {
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: theme.primaryBackgroundColor,
            borderBottomColor: theme.borderBottomColor,
          },
        ]}>
        <ReactionsGroup
          onReaction={hidePostActions}
          postId={postActions.postId}
          userId={postActions.userId}
        />
      </View>
    );
  };

  onRepost = () => {
    const {postActions} = this.props;
    const base_post_id = postActions.options.showRepost;
    const requiredChannelId = postActions.options.showRepostNoRequieredRedirect;
    this.props.setRepostActiveOnInput(base_post_id);
    if (requiredChannelId) {
      this.props.setActiveFocusChannel(requiredChannelId);
      this.props.navigateIfExists(null, requiredChannelId);
    }
    this.props.hidePostActions();
  };

  onUnFlagMessage = () => {
    if (this.state.loadingDelete) {
      return null;
    }

    this.setState(
      {
        loadingDelete: true,
      },
      async () => {
        try {
          const {postActions, removeFlagged, me} = this.props;
          await removeFlagged(me, postActions.postId);
          this.props.hidePostActions();
        } catch (ex) {
          alert(ex);
        } finally {
          this.setState({
            loadingDelete: false,
          });
        }
      },
    );
  };

  renderBottomSheetContent = () => {
    const {postActions, me, isFlagged, sponsored_id} = this.props;
    const { themeName, theme } = this.props
    return (
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.primaryBackgroundColor,
            height: 'auto',
          },
        ]}>
        {postActions.userId === me && (
          <React.Fragment>
            <TouchableOpacity style={styles.button}>
              <View style={styles.iconButton}>
                <Image source={assets[themeName].EDIT} />
              </View>
              <Text
                style={[styles.textButton, {color: theme.primaryTextColor}]}
                onPress={this.onEditMessage}>
                Edit Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <View style={styles.iconButton}>
                <Image source={assets[themeName].DELETE} />
              </View>
              <Text
                style={[styles.deleteButton, {color: theme.tiltRed}]}
                onPress={this.onDeleteMessage}>
                Delete Message
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
        {!postActions.options.hideReply && (
          <TouchableOpacity style={styles.button} onPress={this.onReplyMessage}>
            <View style={styles.iconButton}>
              <Image source={assets[themeName].REPLY} />
            </View>
            <Text style={[styles.textButton, {color: theme.primaryTextColor}]}>
              Reply
            </Text>
          </TouchableOpacity>
        )}
        {postActions.options.showRepost && (
          <TouchableOpacity style={styles.button} onPress={this.onRepost}>
            <View style={styles.iconButton}>
              <Image source={assets[themeName].REPOST} />
            </View>
            <Text style={[styles.textButton, {color: theme.primaryTextColor}]}>
              Repost
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button}>
          <View style={styles.iconButton}>
            <Image source={assets[themeName].FLAG} />
          </View>
          {isFlagged ? (
            <Text
              style={[styles.textButton, {color: theme.primaryTextColor}]}
              onPress={this.onUnFlagMessage}>
              Unflag
            </Text>
          ) : (
            <Text
              style={[styles.textButton, {color: theme.primaryTextColor}]}
              onPress={this.onFlagMessage}>
              Flag
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconButton}>
            <Image source={assets[themeName].COPY} />
          </View>
          <Text
            onPress={this.onCopyTextMessage}
            style={[styles.textButton, {color: theme.primaryTextColor}]}>
            Copy Text
          </Text>
        </TouchableOpacity>
        {postActions &&
          postActions.userId !== me &&
          !sponsored_id.match(postActions.userId) &&
          !mod_user_id.match(postActions.userId) &&
          !tilt_user_id.match(postActions.userId) &&
          !moderator_user_id.match(postActions.userId) && (
            <>
              <TouchableOpacity style={styles.button}>
                <View style={styles.iconButton}>
                  <Image source={assets[themeName].REPORT} />
                </View>
                <Text
                  onPress={this.onRepostPost}
                  style={[styles.textButton, {color: theme.primaryTextColor}]}>
                  Report Post
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <View style={styles.iconButton}>
                  <Image source={assets[themeName].BLOCK} />
                </View>
                <Text
                  onPress={this.onBlockUser}
                  style={[
                    styles.textButton,
                    styles.blockUser,
                    {color: theme.tiltRed},
                  ]}>
                  Block User
                </Text>
              </TouchableOpacity>
            </>
          )}
      </View>
    );
  };

  onBlockUser = () => {
    const {postData} = this.props;
    if (this.state.loading) {
      return 0;
    }
    this.setState(
      {
        loading: true,
      },
      () => {
        try {
          this.props.addOrRemoveOne(postData.user_id);
          this.props.hidePostActions();
        } catch (err) {
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  onRepostPost = () => {
    const {postData} = this.props;
    if (this.state.loading) {
      return 0;
    }
    this.setState(
      {
        loading: true,
      },
      () => {
        try {
          this.props.reportPostById(postData.id);
          this.props.hidePostActions();
        } catch (err) {
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  evaluateShow() {
    const {hidePriority} = this.state;
    const {show} = this.props;
    if (show && !hidePriority) {
      return true;
    }
    if (show && hidePriority) {
      return false;
    }
    return show;
  }

  render() {
    const {me, postActions} = this.props;
    return (
      <Modal
        isVisible={postActions.display}
        deviceHeight={H}
        deviceWidth={W}
        onBackdropPress={this.props.hidePostActions}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{justifyContent: 'center', alignItems: 'center'}}
        onModalHide={this.props.resetPostActions}
        animationInTiming={350}
        animationOutTiming={350}
        hideModalContentWhileAnimating
        useNativeDriver>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 'auto',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 12,
            overflow: 'hidden',
          }}>
          {this.renderBottomSheetHeader()}
          {this.renderBottomSheetContent()}
        </View>
      </Modal>
    );
  }
}

PostBottomActions.defaultProps = {
  postActions: {
    display: false,
    postId: '',
    userId: '',
    options: {},
  },
};

const mapStateToProps = state => ({
  postActions: state.postActions,
  me: state.login.user ? state.login.user.id : null,
  postData: getPostById(state, state.postActions.postId),
  isFlagged: state.flagged.posts[state.postActions.postId],
  sponsored_id: state.sponsored,
  theme: state.themes[state.themes.current],
  themeName: state.themes.current,
});

const mapDispatchToProps = {
  addReaction,
  deletePost,
  setFlagged,
  removeFlagged,
  dispatchPostReply: postReply,
  setActiveThreadData,
  setActiveEditPostId,
  hidePostActions,
  resetPostActions,
  setRepostActiveOnInput,
  setActiveFocusChannel,
  navigateIfExists,
  reportPostById,
  addOrRemoveOne,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostBottomActions);
