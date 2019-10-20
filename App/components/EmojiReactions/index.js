import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import Dislike from '../IconStore/Dislike';
import Eyes from '../IconStore/Eyes';
import Laughs from '../IconStore/Laughs';
import Like from '../IconStore/Like';
import Rocket from '../IconStore/Rocket';
import SadFace from '../IconStore/SadFace';
import Reply from '../IconStore/Reply';

import styles from './styles';

export default class Feedback extends PureComponent {
  getFace() {
    let {
      face
    } = this.props;
    face = face ? face.toLowerCase() : '';
    switch (face) {
      case 'eyes': return <Eyes />;
      case 'dislike': return <Dislike />;
      case 'rocket': return <Rocket />;
      case 'like': return <Like />;
      case 'laughs': return <Laughs />;
      case 'sadface': return <SadFace />;
      case 'replies': return <Reply />;
      case '': return <Text />;
      default: return <Text>No Icon Found</Text>;
    }
  }

  render() {
    const {
      borderLess,
      size,
      onPress
    } = this.props;
    return (
      <TouchableOpacity style={[styles.emojiReactions, borderLess ? styles.borderLess : {}]} onPress={onPress}>
        {this.getFace()}
        <Text style={styles.emojiReactionsText}>
          {size}
        </Text>
      </TouchableOpacity>
    );
  }
}
