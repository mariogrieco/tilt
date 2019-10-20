import React from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import styles from './styles';

const CAMERA = require('../../../assets/images/camera/camera.png');

export default class Picture extends React.PureComponent {
  handleCamera = () => {
    const { onPressCamera } = this.props;

    if (onPressCamera) {
      const options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          onPressCamera(new Error('User cancelled image picker'), null);
        } else if (response.error) {
          onPressCamera(response.error, null);
        } else {
          onPressCamera(null, response);
        }
      });
    }
  }

  render() {
    const {
      userStatus,
      camera,
      source
    } = this.props;
    return (
      <View style={styles.container}>

        <View style={styles.pictureContainer}>
          <ImageBackground source={source} style={styles.picture}>
            <View style={[styles.bubble, styles[userStatus]]} />
          </ImageBackground>
        </View>
        {camera && (
          <TouchableOpacity style={styles.camera} onPress={this.handleCamera}>
            <Image source={CAMERA} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

Picture.defaultProps = {
  onPressCamera: null,
  camera: false,
};
