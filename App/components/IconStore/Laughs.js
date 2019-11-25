import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const LAUGHS = require('../../../assets/themes/light/laughs/laughs.png');
const LAUGHS2 = require('../../../assets/themes/light/laughs2/laughs2.png');

export default class Laughs extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image
        source={LAUGHS}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    ) : (
      <Image
        source={LAUGHS2}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    );
  }
}
