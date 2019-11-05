import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const DISLIKE = require('../../../assets/themes/light/dislike/dislike.png');
const DISLIKE2 = require('../../../assets/themes/light/dislike2/dislike2.png');

export default class Dislike extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image source={DISLIKE} />
    ) : (
      <Image source={DISLIKE2} />
    );
  }
}
