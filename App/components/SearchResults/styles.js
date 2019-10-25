import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
  },
  body: {
    flex: 1,
    paddingBottom: 10,
    backgroundColor: '#f6f7f9',
  },
  header: {
    backgroundColor: '#F6F7F9',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 3,
    paddingBottom: 3,
    borderTopColor: '#DCDCDC',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Medium',
  },
  channelTitleContainer: {
    paddingLeft: 10,
    // paddingTop: 5,
  },
  channelTitle: {
    color: '#005493',
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
    // fontWeight: 'bold'
  },
});
