import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    position: 'relative',
  },
  pictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    // backgroundColor: '#434343',
  },
  picture: {
    width: '100%',
    height: '100%'
  },
  bubble: {
    left: -7,
    top: -7,
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 14
  },
  available: {
    backgroundColor: '#FC3E30'
  },
  camera: {
    right: 0,
    bottom: 0,
    position: 'absolute',
    zIndex: 999
  }
});
