import React, {PureComponent} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Text, Image} from 'react-native';

const PULL_BLUE = require('../../../assets/images/poll-blue/poll-blue.png');
const FIRE = require('../../../assets/images/fire/fire.png');
const NEW = require('../../../assets/images/new/new.png');
const BITNAMI = require('../../../assets/images/bitnami/bitcoin.png');
const ALL = require('../../../assets/images/all/all-included.png');

import styles from './styles';

export default class TabButton extends PureComponent {
  getImage(file_name) {
    switch (file_name.toLowerCase()) {
      case 'bitnami':
        return <Image source={BITNAMI} />;
      case 'new':
        return <Image source={NEW} />;
      case 'pull':
        return <Image source={PULL_BLUE} />;
      case 'fire':
        return <Image source={FIRE} />;
      case 'all':
        return <Image source={ALL} />;
      default:
        return null;
    }
  }

  render() {
    const {file_name, text, onPress} = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        {this.getImage(file_name)}
        <Text style={styles.text}>
          {'  '} {text}{' '}
        </Text>
      </TouchableOpacity>
    );
  }
}
