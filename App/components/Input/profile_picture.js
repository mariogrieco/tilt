import React, { Component } from 'react'
import { View, Image } from 'react-native'

import styles from './styles';

const containerStyle = { paddingLeft: 10, paddingTop: 10 };

export default class ProfilePicture extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.loggedUserPicture !== this.props.loggedUserPicture
  }
  render() {
    const {
      loggedUserPicture
    } = this.props;
    return (
      <View style={containerStyle}>
        <Image source={{ uri: loggedUserPicture }} style={styles.inputPicture} />
      </View>
    );
  }
}
