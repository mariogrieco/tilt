import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    position: 'relative',
  },
  pictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    // backgroundColor: '#434343',
  },
  picture: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    left: -7,
    top: -7,
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 14,
  },
  available: {
    backgroundColor: '#FC3E30',
  },
  camera: {
    right: -4,
    bottom: -4,
    position: 'absolute',
    zIndex: 999,
  },
});
