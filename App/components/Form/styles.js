import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  forgotPassword: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Medium',
    color: '#17C491',
    paddingBottom: 15,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#17C491',
    width: '22.5rem',
    height: 44,
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: 'white',
    // alignSelf: 'stretch',
    // textAlignVertical: 'center',
    textAlign: 'center',
    paddingTop: 10,
    borderRadius: 22,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5
  },
  enable: {
    opacity: 1
  }
});
