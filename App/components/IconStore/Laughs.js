import React, {PureComponent} from 'react';
import {Image, Platform} from 'react-native';

const LAUGHS = require('../../../assets/images/laughs/laughs.png');
const LAUGHS2 = require('../../../assets/images/laughs2/laughs2.png');

export default class Laughs extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image source={LAUGHS} />
    ) : (
      <Image source={LAUGHS2} />
    );
  }
}
