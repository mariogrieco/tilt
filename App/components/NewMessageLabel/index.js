import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import styles from './styles';

const CANCEL = require('../../../assets/themes/light/cancel/cancel.png');

export default class NewMessageLabel extends React.PureComponent {
  render() {
    const {onPress, onClose, length} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.textContainer} onPress={onPress}>
          <Text style={styles.span}>{length} New Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Image source={CANCEL} />
        </TouchableOpacity>
      </View>
    );
  }
}
