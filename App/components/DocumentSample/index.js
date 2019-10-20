import React, { PureComponent } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Linking
} from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';
import prettyBytes from 'pretty-bytes';
import {
  Files
} from '../Input/file_utils';
import Client4 from '../../api/MattermostClient';

import styles from './styles';
// import RNFS from 'react-native-fs';
// import RNBackgroundDownloader from 'react-native-background-downloader';

// const DOWNLOAD_FILLED = require('../../../assets/images/download-filled/download-filled.png');
const DOWNLOAD_UNFILLED = require('../../../assets/images/download-unfilled/download-unfilled.png');
const EXCEL = require('../../../assets/images/excel-file/excel.png');
const PDF = require('../../../assets/images/pdf-file/pdf.png');
const WORD = require('../../../assets/images/word-file/word.png');
const DOWNLOAD_COMPLETE = require('../../../assets/images/download-complete/completedCheck.png');
const STANDARD_FILE = require('../../../assets/images/standard-file/folder.png');
const POWERPOINT = require('../../../assets/images/powerpoint-file/powerpoint.png');
const AUDIO = require('../../../assets/images/audio-file/audio.png');
const VIDEO = require('../../../assets/images/video-file/video.png');
const IMAGE = require('../../../assets/images/image-file/image.png');

export default class DocumentSample extends PureComponent {
  state = {
    downloading: false,
    downloadComplete: false,
    percentage: 0,
    downloadError: null
  }

  getCurrentIcon(ext) {
    if (Files.WORD_TYPES.includes(ext)) {
      return WORD;
    }
    if (Files.PDF_TYPES.includes(ext)) {
      return PDF;
    }
    if (Files.SPREADSHEET_TYPES.includes(ext)) {
      return EXCEL;
    }
    if (Files.PRESENTATION_TYPES.includes(ext)) {
      return POWERPOINT;
    }
    if (Files.VIDEO_TYPES.includes(ext)) {
      return VIDEO;
    }
    if (Files.VIDEO_TYPES.includes(ext)) {
      return AUDIO;
    }
    if (Files.IMAGE_TYPES.includes(ext)) {
      return IMAGE;
    }
    return STANDARD_FILE;
  }

  // downloadFileAndroid = async () => {
  //   const { fileId, name } = this.props;
  //   console.log('onpress for download', name);
  //   const { link } = await Client4.getFilePublicLink(fileId).catch(err => console.log(err));
  //   const { dirs } = RNFetchBlob.fs;
  //   this.setState({
  //     downloading: true
  //   }, () => {
  //     RNFetchBlob
  //       .config({
  //         // response data will be saved to this path if it has access right.
  //         path: `${dirs.DownloadDir}/${name.replace('%20', '-')}`
  //       })
  //       .fetch('GET', link, {
  //         // some headers ..
  //       })
  //       .progress((received, total) => {
  //         const progress = Math.floor((received / total) * 100);
  //         console.log('progress', progress);
  //         this.setState({
  //           percentage: progress
  //         });
  //       })
  //       .then((res) => {
  //         // the path should be dirs.DocumentDir + 'path-to-file.anything'
  //         console.log('The file saved to ', res.path());
  //         // Alert.alert('Your file has been downloaded', res.path());


  //         this.setState({
  //           downloading: false,
  //           downloadComplete: true
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         this.setState({
  //           downloadError: err,
  //           downloading: false,
  //           percentage: ''
  //         });
  //       });
  //   });
  // }

  donwloadFile = async () => {
    const { fileId, name } = this.props;
    console.log('onpress for download', name);
    const { link } = await Client4.getFilePublicLink(fileId).catch(err => console.log(err));

    Linking.openURL(link);
  }

   onPress = () => {
     //  if (Platform.OS === 'android') {
     //    this.downloadFileAndroid();
     //  } else {
     //    this.downloadFileIOS();
     //  }
     this.donwloadFile();
   }

   renderDownloadControls = () => {
     const {
       downloading,
       downloadComplete,
       percentage,
       downloadError
     } = this.state;

     if (downloading) {
       return (
         <View style={{
           width: 60, height: 60, justifyContent: 'center', alignItems: 'center'
         }}
         >
           <Text style={{
             color: '#17C491', fontFamily: 'SFProDisplay-Bold', fontSize: 15, letterSpacing: 0.1
           }}
           >
             {`${percentage}%`}
           </Text>
         </View>
       );
     }
     if (downloadError) {
       return (
         <React.Fragment>
           <TouchableOpacity style={styles.downloadIconContainer} onPress={this.onPress}>
             <Image source={DOWNLOAD_UNFILLED} />
           </TouchableOpacity>
           <Text>{downloadError}</Text>
         </React.Fragment>
       );
     } if (downloadComplete) {
       return (
         <View style={styles.downloadIconContainer}>
           <Image source={DOWNLOAD_COMPLETE} />
         </View>
       );
     }
     return (
       <TouchableOpacity style={styles.downloadIconContainer} onPress={this.onPress}>
         <Image source={DOWNLOAD_UNFILLED} style={styles.downloadIcon} />
       </TouchableOpacity>
     );
   }

   render() {
     const {
       extension,
       name,
       size
     } = this.props;

     return (
       <View style={[styles.documentContainer]}>
         <View style={{ paddingRight: 15, alignItems: 'center', alignSelf: 'center' }}>
           <Image source={this.getCurrentIcon(extension)} />
         </View>
         <View style={{ flex: 1 }}>
           <Text style={styles.documentName}>{name}</Text>
           <Text>{prettyBytes(size)}</Text>
         </View>
         {
          this.renderDownloadControls()
         }
       </View>
     );
   }
}
