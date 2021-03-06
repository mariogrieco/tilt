import StyleSheet from 'react-native-extended-stylesheet';
import Platform from 'react-native';

export default StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
    backgroundColor: '#F6F7F9',
  },
  channelName: {
    color: '#017AFE',
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
  unreadText: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#fff',
    fontSize: 13,
    letterSpacing: 0.1,
  },
  unreadMessages: {
    marginLeft: 5,
    borderRadius: 11,
    paddingHorizontal: 8,
    backgroundColor: '#17C491',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
