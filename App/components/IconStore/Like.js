import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const LIKE = require('../../../assets/images/like/like.png');
const LIKE2 = require('../../../assets/images/like2/like2.png');

export default class Like extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image source={LIKE} />
    ) : (
      <Image source={LIKE2} />
    );
  }
}
