import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerContainer: {
    paddingTop: '0.75rem',
    paddingBottom: '0.625rem',
  },
  header: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#585c63',
  },
  listITemContainer: {
    flexDirection: 'row',
    paddingTop: '0.75rem',
    paddingBottom: '0.8125rem',
  },
  listText: {
    fontFamily: 'SFMono-Medium',
    color: '$textColor',
    fontSize: 14,
    letterSpacing: -0.5,
  },
});
