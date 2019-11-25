import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const LIKE = require('../../../assets/themes/light/like/like.png');
const LIKE2 = require('../../../assets/themes/light/like2/like2.png');

export default class Like extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image
        source={LIKE}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    ) : (
      <Image
        source={LIKE2}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    );
  }
}
