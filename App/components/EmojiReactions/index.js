import React, {PureComponent} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Dislike from '../IconStore/Dislike';
import Eyes from '../IconStore/Eyes';
import Laughs from '../IconStore/Laughs';
import Like from '../IconStore/Like';
import Rocket from '../IconStore/Rocket';
import SadFace from '../IconStore/SadFace';
import Reply from '../IconStore/Reply';

import num_format from '../../utils/numberFormat';

import styles from './styles';

class Feedback extends PureComponent {
  getFace() {
    let {face} = this.props;
    face = face ? face.toLowerCase() : '';
    switch (face) {
      case 'eyes':
        return <Eyes />;
      case 'dislike':
        return <Dislike />;
      case 'rocket':
        return <Rocket />;
      case 'like':
        return <Like />;
      case 'laughs':
        return <Laughs />;
      case 'sadface':
        return <SadFace />;
      case 'replies':
        return <Reply />;
      case '':
        return <Text />;
      default:
        return <Text>No Icon Found</Text>;
    }
  }

  render() {
    const {borderLess, size, onPress, theme} = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.emojiReactions,
          borderLess ? styles.borderLess : {},
          {
            backgroundColor: theme.emojiReactionsBackgroundColor,
            borderColor: theme.emojiReactionsBorderBackgroundColor,
          },
        ]}
        onPress={onPress}>
        {this.getFace()}
        <Text
          style={[styles.emojiReactionsText, {color: theme.primaryTextColor}]}>
          {' '}
          {num_format(size)}{' '}
        </Text>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(mapStateToProps)(Feedback);
