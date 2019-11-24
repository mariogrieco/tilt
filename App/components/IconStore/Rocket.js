import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const ROCKET = require('../../../assets/themes/light/rocket/rocket.png');
const ROCKET2 = require('../../../assets/themes/light/rocket2/rocket2.png');

export default class Rocket extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image
        source={ROCKET}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    ) : (
      <Image
        source={ROCKET2}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    );
  }
}
