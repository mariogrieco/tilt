import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
    backgroundColor: '#f6f7f9',
  },
  channelName: {
    color: '#005493',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
    paddingLeft: 10,
    // paddingTop: 10,
  },
  emptyContainer: {
    paddingTop: '10rem',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  emptyText: {
    paddingTop: 20,
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '#8E8E95',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  unreadMessages: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#fff',
    marginLeft: 10,
    borderRadius: 20,
    paddingHorizontal: 7.5,
    paddingVertical: 2,
    backgroundColor: '#17C491',
    width: 28,
    height: 24,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
