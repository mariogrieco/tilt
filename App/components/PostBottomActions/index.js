import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Clipboard,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import Dimensions from 'react-native-extra-dimensions-android';
import { connect } from 'react-redux';
import { addReaction } from '../../actions/reactions';
import Client4 from '../../api/MattermostClient';
import {
  deletePost,
  hidePostActions,
  resetPostActions
} from '../../actions/posts';
import {
  setFlagged,
  removeFlagged
} from '../../actions/flagged';
import { postReply } from '../../actions/reply';
import {
  setActiveThreadData,
  setActiveEditPostId
} from '../../actions/AppNavigation';
import ReactionsGroup from '../ReactionsGroup';
import getPostById from '../../selectors/getPostById';

import NavigationService from '../../config/NavigationService';
import styles from './styles';

const EDIT = require('../../../assets/images/edit/edit.png');
const DELETE = require('../../../assets/images/delete/trash.png');
const REPLY = require('../../../assets/images/reply/reply.png');
const FLAG = require('../../../assets/images/flag/flag.png');
// const COPY_LINK = require('../../../assets/images/link/link.png');
const COPY_TEXT = require('../../../assets/images/copy/copy.png');

const H = Dimensions.get('REAL_WINDOW_HEIGHT');
const W = Dimensions.get('REAL_WINDOW_WIDTH');

class PostBottomActions extends React.PureComponent {
  state = {
    loadingFlag: false,
    loadingDelete: false,
    hidePriority: false
  }

  componentWillUnmount() {
    this.props.hidePostActions();
  }

  onEditMessage = () => {
    const {
      setActiveEditPostId,
      postActions,
    } = this.props;
    setActiveEditPostId(postActions.postId);
    this.props.hidePostActions();
    NavigationService.navigate('ThreadEdit');
  }

  onDeleteMessage = () => {
    if (this.state.loadingDelete) return null;

    this.setState({
      loadingDelete: true
    }, async () => {
      const {
        postActions,
      } = this.props;
      try {
        await this.props.deletePost(postActions.postId);
        this.props.hidePostActions();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingDelete: false
        });
      }
    });
  }

  onReplyMessage = () => {
    const {
      dispatchPostReply,
      postActions,
      setActiveThreadData,
      postData
    } = this.props;
    dispatchPostReply(postActions.postId, postActions.userId);
    setActiveThreadData(postActions.postId);
    this.props.hidePostActions();
    // setTimeout(() => {
    NavigationService.navigate('Thread');
    // }, 1000);
  }

  onFlagMessage = () => {
    if (this.state.loadingDelete) return null;

    this.setState({
      loadingDelete: true
    }, async () => {
      try {
        const {
          postActions,
          setFlagged,
          me
        } = this.props;
        const r = await setFlagged(me, postActions.postId);
        this.props.hidePostActions();
        // alert('r');
        console.log(r);
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingDelete: false
        });
      }
    });
  }

  onCopyLinkToMessage = () => {
    const { id } = this.props.postData;
    const str = Client4.getPostRoute(id);
    // alert(str);
    this._clipboard(str);
    this.props.hidePostActions();
  }

  _clipboard(str) {
    try {
      Clipboard.setString(str);
    } catch (er) {
      alert(err.message || er);
    }
  }

  onCopyTextMessage = () => {
    const { postData } = this.props;
    this._clipboard(postData.message);
    this.props.hidePostActions();
  }


  renderBottomSheetHeader = () => {
    const { postActions, hidePostActions } = this.props;
    return (
      <View
        style={[styles.headerContainer, { justifyContent: 'space-around', alignItems: 'center' }]}
      >
        <ReactionsGroup
          onReaction={hidePostActions}
          postId={postActions.postId}
          userId={postActions.userId}
        />
      </View>
    );
  }

  onUnFlagMessage = () => {
    if (this.state.loadingDelete) return null;

    this.setState({
      loadingDelete: true
    }, async () => {
      try {
        const {
          postActions,
          removeFlagged,
          me
        } = this.props;
        await removeFlagged(me, postActions.postId);
        this.props.hidePostActions();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingDelete: false
        });
      }
    });
  }

  renderBottomSheetContent = () => {
    const { postActions, me, isFlagged } = this.props;
    return (
      <View
        style={[styles.contentContainer]}
      >
        {
          (postActions.userId === me)
          && (
            <React.Fragment>
              <TouchableOpacity style={styles.button}>
                <View style={styles.iconButton}>
                  <Image source={EDIT} />
                </View>
                <Text style={styles.textButton} onPress={this.onEditMessage}>Edit Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <View style={styles.iconButton}>
                  <Image source={DELETE} />
                </View>
                <Text
                  style={styles.deleteButton}
                  onPress={this.onDeleteMessage}
                >
                  Delete Message
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          )
        }
        {
          (!postActions.options.hideReply) && (
            <TouchableOpacity style={styles.button} onPress={this.onReplyMessage}>
              <View style={styles.iconButton}>
                <Image source={REPLY} />
              </View>
              <Text style={styles.textButton}>Reply</Text>
            </TouchableOpacity>
          )
        }

        <TouchableOpacity style={styles.button}>
          <View style={styles.iconButton}>
            <Image source={FLAG} />
          </View>
          {
            isFlagged
              ? (
                <Text
                  style={styles.textButton}
                  onPress={this.onUnFlagMessage}
                >
              Unflag
                </Text>
              )
              : (
                <Text
                  style={styles.textButton}
                  onPress={this.onFlagMessage}
                >
              Flag
                </Text>
              )
          }
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button}> */}
        {/*  <View style={styles.iconButton}> */}
        {/*    <Image source={COPY_LINK} /> */}
        {/*  </View> */}
        {/*  <Text onPress={this.onCopyLinkToMessage} style={styles.textButton}> */}
        {/*    Copy Link to Message */}
        {/*  </Text> */}
        {/* </TouchableOpacity> */}
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconButton}>
            <Image source={COPY_TEXT} />
          </View>
          <Text onPress={this.onCopyTextMessage} style={styles.textButton}>
            Copy Text
          </Text>
        </TouchableOpacity>
      </View>
    );
  }


  evaluateShow() {
    const { hidePriority } = this.state;
    const { show } = this.props;
    if (show && !hidePriority) return true;
    if (show && hidePriority) return false;
    return show;
  }

  render() {
    const {
      me, postActions
    } = this.props;
    return (
      <Modal
        isVisible={postActions.display}
        deviceHeight={H}
        deviceWidth={W}
        onBackdropPress={this.props.hidePostActions}
        style={{ justifyContent: 'center', alignItems: 'center' }}
        onModalHide={this.props.resetPostActions}
        animationInTiming={350}
        animationOutTiming={350}
        hideModalContentWhileAnimating
        useNativeDriver
      >
        <View
          style={[{
            width: '100%',
            height: Platform.OS === 'ios' ? 290 : 300,
            backgroundColor: '#fff',
            borderRadius: 12,
            overflow: 'hidden'
          },
          (postActions.userId !== me)
            ? { height: Platform.OS === 'ios' ? 205 : 215 }
            : {},
          (postActions.options.hideReply === true)
            ? { height: Platform.OS === 'ios' ? 200 : 210 }
            : {},
          (postActions.options.hideReply === true && postActions.userId !== me)
            ? { height: Platform.OS === 'ios' ? 160 : 170 }
            : {},
          ]}
        >
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
    options: {}
  },
};

const mapStateToProps = state => ({
  postActions: state.postActions,
  me: state.login.user ? state.login.user.id : null,
  postData: getPostById(state, state.postActions.postId),
  isFlagged: state.flagged.posts[state.postActions.postId]
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
  resetPostActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostBottomActions);