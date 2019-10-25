import React, {Component} from 'react';
import {View} from 'react-native';
import isEqual from 'lodash/isEqual';
import Feedback from '../EmojiReactions';
import styles from './style';

export default class Reactions extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  render() {
    const {
      reactions,
      replies,
      disableInteractions,
      onEyes,
      onReply,
      onRocket,
      onSadFace,
      onLikes,
      onDislike,
      onLaughs,
    } = this.props;
    return (
      <View style={styles.feedbackContainer}>
        {!!reactions.likes && (
          <Feedback
            size={reactions.likes}
            face="like"
            onPress={disableInteractions ? () => {} : onLikes}
          />
        )}
        {!!reactions.dislikes && (
          <Feedback
            size={reactions.dislikes}
            face="dislike"
            onPress={disableInteractions ? () => {} : onDislike}
          />
        )}
        {!!reactions.laughs && (
          <Feedback
            size={reactions.laughs}
            face="laughs"
            onPress={disableInteractions ? () => {} : onLaughs}
          />
        )}
        {!!reactions.sadFace && (
          <Feedback
            size={reactions.sadFace}
            face="sadface"
            onPress={disableInteractions ? () => {} : onSadFace}
          />
        )}
        {!!reactions.rocket && (
          <Feedback
            size={reactions.rocket}
            face="rocket"
            onPress={disableInteractions ? () => {} : onRocket}
          />
        )}
        {!!reactions.eyes && (
          <Feedback
            size={reactions.eyes}
            face="eyes"
            onPress={disableInteractions ? () => {} : onEyes}
          />
        )}
        {!!replies && (
          <Feedback
            size={replies}
            onPress={disableInteractions ? () => {} : onReply}
            face="replies"
          />
        )}
      </View>
    );
  }
}
