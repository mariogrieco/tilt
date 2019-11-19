import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const EYES = require('../../../assets/themes/light/eyes/eyes.png');
const EYES2 = require('../../../assets/themes/light/eyes2/eyes2.png');

export default class Eyes extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image source={EYES} />
    ) : (
      <Image source={EYES2} />
    );
  }
}
