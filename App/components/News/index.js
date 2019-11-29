import React, {PureComponent} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';

import styles from './styles';

export default class News extends PureComponent {
  render() {
    return (
      <TouchableOpacity style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.title}>See what’s moving the markets and how to trade around it.</Text>
          <Text style={styles.span}>CoinMarket Cap 5h ago</Text>
        </View>
        <Image
          source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
          style={[styles.Image, styles.right]}
        />
      </TouchableOpacity>
    );
  }
}
