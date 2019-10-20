import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '1.438rem',
    paddingLeft: '0.9375rem',
    paddingRight: '1rem',
    // marginBottom: '0.3rem'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastPrice: {
    fontSize: 22,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
    color: '$textColor',
  },
  toggle: {
    flexDirection: 'row',
    height: 29,
    backgroundColor: '#f6f7f9',
    alignItems: 'center',
    borderRadius: 14.5,
  },
  toggleText: {
    paddingLeft: 21,
    paddingRight: 24,
    fontSize: 16,
    letterSpacing: 0.1,
    paddingTop: 4,
    paddingBottom: 6,
    fontFamily: 'SFProDisplay-Medium',
    // letterSpacing: -0.89,
  },
  toggleSelected: {
    backgroundColor: '#17C491',
    color: '#fff',
    borderRadius: 14.5,
  },
  toggleUnSelected: {
    color: '$textColor',
  },
});
