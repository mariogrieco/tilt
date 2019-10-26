import React from 'react';
import {
  Platform,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {hidePostMediaBox, closedPostMediaBox} from '../../actions/posts';
import Client4 from '../../api/MattermostClient';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );

const CLOSE = require('../../../assets/images/cancel-white/cancel-white.png');
const DOWNLOAD = require('../../../assets/images/download-filled/download-filled.png');

const PostMediaModal = ({postMedia, closedModal, hideModal}) => {
  const getInnerComponent = () => {
    if (postMedia.type === 'image') {
      return (
        <TouchableWithoutFeedback style={{flex: 0.8}} onPress={hideModal}>
          <Image
            source={{uri: postMedia.uri}}
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      );
    }
    if (postMedia.type === 'video') {
      return <View style={{flex: 0.9, backgroundColor: '#FFF'}} />;
    }
    return <View style={{flex: 0.9, backgroundColor: '#FFF'}} />;
  };

  const download = async () => {
    try {
      const {link} = await Client4.getFilePublicLink(postMedia.id).catch(err =>
        console.log(err),
      );

      Linking.openURL(link);
    } catch (err) {
      Alert.alert(err);
    }
  };
  return (
    <Modal
      isVisible={postMedia.isVisible}
      deviceWidth={deviceWidth}
      deviceHeight={deviceHeight}
      // onSwipeComplete={hideModal}
      // swipeDirection="down"
      onModalHide={closedModal}
      // style={{ justifyContent: 'center', alignItems: 'center' }}
      animationIn="fadeIn"
      animationOut="slideOutDown"
      hideModalContentWhileAnimating
      useNativeDriver
      backdropColor="#111823"
      backdropOpacity={1}
      onBackdropPress={hideModal}
      animationInTiming={200}
      animationOutTiming={200}>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, position: 'relative'}}>
          <View
            style={{
              paddingTop: Platform.OS === 'ios' ? ifIphoneX(20, 10) : 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              // backgroundColor: 'red'
            }}>
            <TouchableOpacity
              onPress={hideModal}
              style={{paddingHorizontal: 15, paddingBottom: 15}}>
              <Image source={CLOSE} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{paddingHorizontal: 15, paddingBottom: 15}}
              onPress={download}>
              <Image source={DOWNLOAD} />
            </TouchableOpacity>
          </View>
          {getInnerComponent()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const mapStateToProps = ({postMedia}) => ({
  postMedia,
});

const mapDispatchToProps = {
  closedModal: closedPostMediaBox,
  hideModal: hidePostMediaBox,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostMediaModal);
