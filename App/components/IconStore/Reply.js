import React, {PureComponent} from 'react';
import {Image} from 'react-native';

const REPLY = require('../../../assets/themes/light/reply_filled/reply_filled.png');

export default class Dislike extends PureComponent {
  render() {
    return (
      <Image
        source={REPLY}
        style={{width: 20, height: 20, resizeMode: 'contain'}}
      />
    );
  }
}
