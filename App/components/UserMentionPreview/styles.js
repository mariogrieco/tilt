import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  mentions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6,
  },
  mentionsProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginRight: 5,
  },
  commandContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 6,
    paddingBottom: 5,
    paddingTop: 6,
  },
  mentionsColor: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
  },
});
