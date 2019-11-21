import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  symbolTitle: {
    color: '#585c63',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
    letterSpacing: -0.48,
  },
  price: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
    textAlign: 'right',
  },
  symbolPercent: {
    color: '#17c491',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    textAlign: 'right',
  },
  redPercent: {
    color: '#fc3e30',
  },
  container: {
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  btnContainer: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  btn: {
    height: 44,
    backgroundColor: '#17c491',
    borderRadius: 18.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'SFProDisplay',
  },
});
