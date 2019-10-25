import React, {PureComponent} from 'react';
import {Text, View, Image, TouchableOpacity, Linking} from 'react-native';
import prettyBytes from 'pretty-bytes';
import Client4 from '../../api/MattermostClient';
import styles from './styles';

const VIDEO = require('../../../assets/images/video-file/video.png');
const PLAY = require('../../../assets/images/play/play-unfilled.png');

export default class VideoSample extends PureComponent {
  onPressDownload = async () => {
    const {
      file: {id},
    } = this.props;
    const {link} = await Client4.getFilePublicLink(id).catch(err =>
      console.log(err),
    );
    Linking.openURL(link);
  };

  render() {
    const {file} = this.props;
    const {name, size} = file;
    return (
      <View style={styles.documentContainer}>
        <View
          style={{paddingRight: 15, alignItems: 'center', alignSelf: 'center'}}>
          <Image source={VIDEO} />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.documentName}>{name}</Text>
          <Text>{prettyBytes(size)}</Text>
        </View>
        <TouchableOpacity
          style={styles.downloadIconContainer}
          onPress={this.onPressDownload}>
          <Image source={PLAY} style={styles.downloadIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}
