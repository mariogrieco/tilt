import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  spanText: {
    color: '#0e141e',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Heavy',
  },
  textBtn: {
    color: 'white',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  btn: {
    backgroundColor: '#17C491',
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    marginTop: 40,
  },
});
