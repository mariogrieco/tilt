import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 68,
    flex: 1,
  },
  pair: {
    fontSize: 16,
    letterSpacing: 0.1,
    color: '$textColor',
    fontFamily: 'SFProDisplay-Bold',
  },
  lastPrice: {
    fontSize: 16,
    letterSpacing: 0.1,
    color: '$textColor',
    fontFamily: 'SFProDisplay-Bold',
  },
  priceChangeContainer: {
    height: 34,
    width: 86,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceChangeChartView: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
  },
  priceChangeListView: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Medium',
    color: '#fff',
  },
  chart: {
    alignSelf: 'center',
  },
});
