import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  mentions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
    paddingBottom: 6
  },
  mentionsProfileImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    flex: 0
  },
  commandContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 6,
    paddingBottom: 5,
    paddingTop: 6
  },
  mentionsColor: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.1
  }
});
