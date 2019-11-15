import React, {PureComponent} from 'react';
import {Text, View, Image, TouchableOpacity, Linking} from 'react-native';
import {connect} from 'react-redux';
import prettyBytes from 'pretty-bytes';
import Client4 from '../../api/MattermostClient';
import styles from './styles';

const VIDEO = require('../../../assets/themes/light/video-file/video.png');
const PLAY = require('../../../assets/themes/light/play/play-unfilled.png');

class VideoSample extends PureComponent {
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
    const {file, theme} = this.props;
    const {name, size} = file;
    return (
      <View
        style={[
          styles.documentContainer,
          {
            backgroundColor: theme.primaryBackgroundColor,
            borderColor: theme.borderBottomColor,
          },
        ]}>
        <View
          style={{paddingRight: 15, alignItems: 'center', alignSelf: 'center'}}>
          <Image source={VIDEO} />
        </View>
        <View style={{flex: 1}}>
          <Text style={[styles.documentName, {color: theme.primaryTextColor}]}>
            {name}
          </Text>
          <Text style={{color: theme.primaryTextColor}}>
            {prettyBytes(size)}
          </Text>
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

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(mapStateToProps)(VideoSample);
