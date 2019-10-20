import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';
import moment from 'moment';
import Separator from '../Separator';

import styles from './styles';

export class SeparatorContainer extends PureComponent {
  render() {
    const {
      createdAt,
      noPadding
    } = this.props;
    return (
      <View style={[styles.separator, noPadding ? { padding: 0 } : {}]}>
        <View style={{ flex: 1 }}>
          <Separator />
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.separatorText}>
            {createdAt ? moment(createdAt).format('ddd, MMM D, YYYY') : 'Today'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Separator />
        </View>
      </View>
    );
  }
}

export default SeparatorContainer;
