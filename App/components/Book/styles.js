import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    flex: 1,
    color: '#585c63',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  headerContainer: {
    paddingTop: '0.75rem',
    paddingBottom: '0.625rem',
    flexDirection: 'row',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '0.75rem',
    paddingBottom: '0.625rem'
  },
  listItem: {
    fontFamily: 'SFMono-Medium',
    color: '$textColor',
    fontSize: 14,
    letterSpacing: -0.5
    // fontFamily: 'SFProDisplay-Regular',
    // letterSpacing: -0.93
  }
});
