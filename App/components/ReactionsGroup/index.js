import React, { Component, Fragment } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import {
  addReaction,
  removeReaction
} from '../../actions/reactions';
import getPostById from '../../selectors/getPostById';
import Dislike from '../IconStore/Dislike';
import Eyes from '../IconStore/Eyes';
import Rocket from '../IconStore/Rocket';
import Laughs from '../IconStore/Laughs';
import SadFace from '../IconStore/SadFace';
import Like from '../IconStore/Like';

import styles from './styles';

export class ReactionsGroup extends Component {
  state = {
    loadingLike: false,
    loadingEye: false,
    loadingRocket: false,
    loadingLaughts: false,
    loadingSadFace: false,
    loadingDislike: false
  }

  getReactions() {
    return this.props.post && this.props.post.metadata ? this.props.post.metadata.reactions : null;
  }


  findEmojiName(name) {
    const reactions = this.getReactions();
    const { userId } = this.props;
    if (reactions) {
      return reactions.find(({ emoji_name, user_id }) => (emoji_name == name && user_id === userId));
    }
    return null;
  }


  onDislike = () => {
    if (this.state.loadingDislike) return null;
    const reactions = this.getReactions();
    this.setState({
      loadingDislike: true
    }, async () => {
      try {
        const {
          postId,
          userId,
          onReaction
        } = this.props;
        if (this.findEmojiName('-1')) {
          await this.props.removeReaction(userId, postId, '-1');
        } else {
          await this.props.addReaction(userId, postId, '-1');
        }
        onReaction();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingDislike: false
        });
      }
    });
  }

  onEyes = () => {
    if (this.state.loadingEye) return null;
    this.setState({
      loadingEye: true
    }, async () => {
      try {
        const {
          postId,
          userId,
          onReaction
        } = this.props;
        if (this.findEmojiName('eyes')) {
          await this.props.removeReaction(userId, postId, 'eyes');
        } else {
          await this.props.addReaction(userId, postId, 'eyes');
        }
        onReaction();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingEye: false
        });
      }
    });
  }


  onRocket = () => {
    if (this.state.loadingRocket) return null;
    this.setState({
      loadingRocket: true
    }, async () => {
      try {
        const {
          postId,
          userId,
          onReaction
        } = this.props;
        if (this.findEmojiName('rocket')) {
          await this.props.removeReaction(userId, postId, 'rocket');
        } else {
          await this.props.addReaction(userId, postId, 'rocket');
        }
        onReaction();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingRocket: false
        });
      }
    });
  }

  onLaughs = () => {
    if (this.state.loadingLaughts) return null;
    this.setState({
      loadingLaughts: true
    }, async () => {
      try {
        const {
          postId,
          userId,
          onReaction
        } = this.props;
        if (this.findEmojiName('joy')) {
          await this.props.removeReaction(userId, postId, 'joy');
        } else {
          await this.props.addReaction(userId, postId, 'joy');
        }
        onReaction();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingLaughts: false
        });
      }
    });
  }

  onSadFace = () => {
    if (this.state.loadingSadFace) return null;
    this.setState({
      loadingSadFace: true
    }, async () => {
      try {
        const {
          postId,
          userId,
          onReaction
        } = this.props;
        if (this.findEmojiName('frowning_face')) {
          await this.props.removeReaction(userId, postId, 'frowning_face');
        } else {
          await this.props.addReaction(userId, postId, 'frowning_face');
        }
        onReaction();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingSadFace: false
        });
      }
    });
  }

  onLikes = () => {
    if (this.state.loadingLike) return null;
    this.setState({
      loadingLike: true
    }, async () => {
      try {
        const {
          postId,
          userId,
          onReaction
        } = this.props;
        if (this.findEmojiName('+1')) {
          await this.props.removeReaction(userId, postId, '+1');
        } else {
          await this.props.addReaction(userId, postId, '+1');
        }
        onReaction();
      } catch (ex) {
        alert(ex);
      } finally {
        this.setState({
          loadingLike: false
        });
      }
    });
  }

  render() {
    return (
      <Fragment>
        <TouchableOpacity style={styles.circle} onPress={this.onLikes}>
          <Like />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={this.onDislike}>
          <Dislike />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={this.onLaughs}>
          <Laughs />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={this.onSadFace}>
          <SadFace />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={this.onRocket}>
          <Rocket />
        </TouchableOpacity>

        <TouchableOpacity style={styles.circle} onPress={this.onEyes}>
          <Eyes />
        </TouchableOpacity>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, props) => ({
  post: getPostById(state, props.postId),
  userId: state.login.user ? state.login.user.id : null
});

const mapDispatchToProps = {
  addReaction,
  removeReaction
};

export default connect(mapStateToProps, mapDispatchToProps)(ReactionsGroup);
