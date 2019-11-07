import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    flex: 0,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 5,
    paddingTop: 5,
    borderColor: '#d9d8d7',
    borderBottomWidth: 1,
    margin: 0,
  },
  imageContainer: {
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    opacity: 0.8,
  },
  username: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'SFProDisplay',
    fontWeight: 'bold',
  },
  unlock: {
    fontFamily: 'SFProDisplay',
    // fontWeight: 'bold',
    color: '#17c491',
    borderRadius: 10,
    minWidth: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 30,
    fontSize: 16,
    lineHeight: 29,
  },
});
