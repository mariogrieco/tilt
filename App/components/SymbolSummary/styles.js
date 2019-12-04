import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  header: {
    color: '#585C63',
    fontSize: 15,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
  },
  priceChangeListView: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Medium',
    color: '#fff',
  },
  label: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 17,
    // fontWidth: 'bold',
    letterSpacing: 0.1,
    marginRight: 10,
  },
  rows: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  priceChangeContainer: {
    height: 34,
    width: 86,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginLeft: 15,
    marginRight: 15,
    height: 68,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  lefContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  pair: {
    textTransform: 'uppercase',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '$textColor',
    fontFamily: 'SFProDisplay-Bold',
  },
});
