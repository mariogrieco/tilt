import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const EYES = require('../../../assets/images/eyes/eyes.png');
const EYES2 = require('../../../assets/images/eyes2/eyes2.png');

export default class Eyes extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image source={EYES} />
    ) : (
      <Image source={EYES2} />
    );
  }
}
