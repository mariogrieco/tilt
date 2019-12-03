import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  separator: {
    backgroundColor: '#f6f7f9',
    height: 35,
    paddingVertical: 15,
    paddingLeft: 15,
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  separatorText: {
    color: '#585c63',
    textTransform: 'uppercase',
    fontFamily: 'SFProDisplay-Bold',
    letterSpacing: 0.1,
    fontSize: 14,
  },
  article: {
    // flex: 1,
  },
  section: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
    flex: 1,
  },
});
