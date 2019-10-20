import React, { PureComponent } from 'react'
import {
  Text,
  View,
  Linking
} from 'react-native'

export default class DeepLinking extends PureComponent {
  async getInitialUrl () {
    try {
      const url = await Linking.getInitialURL();
      alert(url);
    } catch (err) {
      alert(err);
    }
  }
  componentDidMount () {}

  render() {
    return (<View><Text>{' '}</Text></View>);
  };
}
