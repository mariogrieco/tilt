import React, { PureComponent } from 'react';
import { Image, Platform } from 'react-native';

const SADFACE = require('../../../assets/images/sad_face/sad_face.png');
const SADFACE2 = require('../../../assets/images/sad_face2/sad_face2.png');

export default class SadFace extends PureComponent {
  render() {
    return Platform.OS === 'ios' ? (
      <Image source={SADFACE} />
    )
      : (
        <Image source={SADFACE2} />
      );
  }
}
