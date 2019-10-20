import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    marginBottom: 10,
    borderBottomColor: '#d9d8d7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff'
  },
  userNames: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 20,
    letterSpacing: 0.1,
    color: '$textColor',
    marginTop: 15,
    marginBottom: 6
  },
  userNickName: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#017AFE',
  },
  headerIcon: {
    width: 22, height: 22, marginRight: 0
  },
  followButton: {
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '$green',
    paddingVertical: 8,
    width: 95,
    height: 35,
    justifyContent: 'center',
    borderRadius: 22
  },
  description: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '#0e141e'
  },
  posts: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
    marginTop: 20,
    marginBottom: 10,
    color: '#0e141e'
  },
  emptyContainer: {
    paddingTop: 100,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  emptyText: {
    paddingTop: 20,
    fontSize: 15,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '#8E8E95',
    textAlign: 'center',
    paddingHorizontal: 15
  },
});
