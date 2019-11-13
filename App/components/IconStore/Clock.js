import React, {PureComponent} from 'react';
import {Image} from 'react-native';

const CLOCK = require('../../../assets/themes/light/clock/clock.png');

export default class Clock extends PureComponent {
  render() {
    return <Image source={CLOCK} />;
  }
}
