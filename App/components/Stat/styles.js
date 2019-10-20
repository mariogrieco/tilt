import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '0.75rem',
    paddingTop: '0.9375rem',

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  number: {
    fontFamily: 'SFMono-Medium',
    color: '$textColor',
    fontSize: 14,
    letterSpacing: -0.5
  },
  lowNumber: {
    fontFamily: 'SFMono-Medium',
    color: '#FC3E30',
    fontSize: 14,
    letterSpacing: -0.5
  },
  highNumber: {
    fontFamily: 'SFMono-Medium',
    color: '#17C491',
    fontSize: 14,
    letterSpacing: -0.5
  },
  tag: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    // letterSpacing: -0.11,
    color: '$textColorLight'
  }

});
