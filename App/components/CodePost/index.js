import React, { PureComponent } from 'react';
import { Text } from 'react-native';

import styles from './styles';

export default class index extends PureComponent {
  getText() {
    const {
      str
    } = this.props;
    return str.replace(/`/g, '');
  }

  render() {
    return (
      <Text style={styles.text}>
        {this.getText()}
      </Text>
    );
  }
}
