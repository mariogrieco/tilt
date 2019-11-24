import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const DISLIKE = require('../../../assets/themes/light/dislike/dislike.png');
const DISLIKE2 = require('../../../assets/themes/light/dislike2/dislike2.png');

export default class Dislike extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image
        source={DISLIKE}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    ) : (
      <Image
        source={DISLIKE2}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    );
  }
}
