import React, { PureComponent } from 'react';
import { Image, Platform } from 'react-native';

const ROCKET = require('../../../assets/images/rocket/rocket.png');
const ROCKET2 = require('../../../assets/images/rocket2/rocket2.png');

export default class Rocket extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image source={ROCKET} />
    )
      : (
        <Image source={ROCKET2} />
      );
  }
}
