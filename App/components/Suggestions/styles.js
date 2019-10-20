import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1
  },
  body: {
    // flex: 1,
  },
  header: {
    backgroundColor: '#F6F7F9',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 3,
    paddingBottom: 3
  },
  title: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1
  },
  channelText: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1
  },
  channelName: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  }
});
