import React, {PureComponent} from 'react';
import {Image} from 'react-native';

const ROUNDEDHECKBOX = require('../../../assets/themes/light/rounded_checkbox/rounded-checkbox.png');

export default class RoundedCheckbox extends PureComponent {
  render() {
    return <Image source={ROUNDEDHECKBOX} />;
  }
}
