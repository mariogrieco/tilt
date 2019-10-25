import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  span: {
    fontFamily: 'SFProDisplay-Bold',
    color: 'white',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  close: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  textContainer: {
    paddingLeft: 15,
    marginLeft: 30,
    alignItems: 'center',
    flex: 1,
  },
  container: {
    backgroundColor: '#17C491',
    height: 29,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
