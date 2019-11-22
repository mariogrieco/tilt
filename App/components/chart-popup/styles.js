import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  symbolTitle: {
    color: '#585c63',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
    letterSpacing: 0.1,
  },
  price: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
    textAlign: 'right',
    letterSpacing: 0.1,
  },
  symbolPercent: {
    color: '#17c491',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    textAlign: 'right',
    letterSpacing: 0.1,
  },
  redPercent: {
    color: '#fc3e30',
  },
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'column',
    borderRadius: 8,
    // height: 565,
  },
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  btnContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  btn: {
    height: 44,
    backgroundColor: '#17c491',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'SFProDisplay-Bold',
    letterSpacing: 0.1,
  },
});
