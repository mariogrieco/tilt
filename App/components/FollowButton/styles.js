import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  followContainer: {
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#17c491',
  },
  follow: {
    backgroundColor: 'transparent',
  },
  unfollow: {
    backgroundColor: '#17c491',
  },
  followButtonText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  followText: {
    color: '#17c491',
  },
  unfollowText: {
    color: '#FFF',
  },
});
