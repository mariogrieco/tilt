import React, {PureComponent} from 'react';
import {Image} from 'react-native';

const REPLY = require('../../../assets/images/reply_filled/reply_filled.png');

export default class Dislike extends PureComponent {
  render() {
    return <Image source={REPLY} />;
  }
}
