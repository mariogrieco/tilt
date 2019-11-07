import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  headerContainer: {
    height: 62,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  blockUser: {
    color: '#fc3e30',
  },
  button: {
    paddingVertical: 12,
    paddingRight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    marginRight: 10,
    marginLeft: 8,
    flex: 0.1,
  },
  textButton: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '$textColor',
    flex: 1,
  },
  deleteButton: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#FC3E30',
    flex: 1,
  },
});
