import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  emptyContainer: {
    paddingTop: '10rem',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  emptyText: {
    paddingTop: 20,
    fontSize: 15,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '#8E8E95',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  listContainer: {
    // paddingLeft: 10,
    paddingBottom: 10,
    backgroundColor: '#f6f7f9',
  },
  channelTitleContainer: {
    paddingLeft: 10,
    paddingTop: 10,
  },
  channelTitle: {
    color: '#005493',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
  },
});
