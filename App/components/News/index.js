import React, {PureComponent} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';

import styles from './styles';

export default class News extends PureComponent {
  render() {
    const {headline, source, image, datetime} = this.props;
    return (
      <TouchableOpacity style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.title}>{headline}</Text>
          <Text style={styles.span}>
            {source}{' '}{moment(datetime).fromNow(true)}
          </Text>
        </View>
        <Image source={{uri: image}} style={[styles.Image, styles.right]} />
      </TouchableOpacity>
    );
  }
}
