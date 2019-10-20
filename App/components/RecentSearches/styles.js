import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    minHeight: 100,
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: 1
  },
  header: {
    backgroundColor: '#DCDCDC',
    paddingLeft: 15,
    paddingRight: 16,
    paddingTop: 2,
    paddingBottom: 2
  },
  recentText: {
    color: '#0e141e',
  },
  title: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Medium'
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 16,
    paddingTop: 6,
    paddingBottom: 6
  }
});
