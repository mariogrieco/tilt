import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    flex: 0,
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 3,
  },
  imageContainer: {
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    opacity: 0.8,
  },
  username: {
    fontSize: 14,
    color: 'black',
  },
  unlock: {
    backgroundColor: '#fc3e30',
    color: 'white',
    borderRadius: 10,
    minWidth: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 30,
    fontSize: 14,
    lineHeight: 29,
  },
});
