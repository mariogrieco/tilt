import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingVertical: 10,
    borderColor: '#DCDCDC',
    borderBottomWidth: 0.5,
    backgroundColor: '#FFF'
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0E141E',
    fontFamily: 'SFProDisplay-Bold',
  },
  unlock: {
    fontFamily: 'SFProDisplay-Medium',
    color: '#17C491',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
