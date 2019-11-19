import StyleSheet from 'react-native-extended-stylesheet';
import Platform from 'react-native';

export default StyleSheet.create({
  red: {
    color: '#fc3e30',
    textTransform: 'uppercase',
  },
  green: {
    color: '#17c491',
    textTransform: 'uppercase',
  },
  container: {
    paddingLeft: 10,
    paddingRight: 15,
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
  },
  repostContainer: {
    paddingLeft: 10,
    paddingRight: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
  },
  usernameAndPostContent: {
    width: '88.5%',
  },
  profileImageContainer: {
    paddingRight: 10,
    //backgroundColor: 'red',
  },
  repostProfileImageAndUsername: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //backgroundColor: 'red',
  },
  url: {
    color: '#017AFE',
  },
  mentions: {
    color: '#017AFE',
    backgroundColor: '#E4EFFF',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  boldText: {
    fontFamily: 'SFProDisplay-Bold',
  },
  mediumText: {
    fontFamily: 'SFProDisplay-Medium',
  },
  italicText: {
    fontFamily: 'SFProDisplay-Italic',
  },
  boldItalicText: {
    fontFamily: 'SFProDisplay-BoldItalic',
  },
  emailText: {
    color: '#017AFE',
  },
  channelPatter: {
    color: '#017AFE',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  replies: {
    borderRadius: 4,
    borderColor: '#017AFE',
    borderWidth: 3,
    backgroundColor: 'rgba(63, 184, 127, 0.1)',
    width: 64,
    height: 34,
    paddingLeft: 4,
    paddingRight: 4,
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#017AFE',
    marginLeft: '0.2rem',
  },
  systemText: {
    color: '#8E8E95',
    fontFamily: 'SFProDisplay-Light',
  },
  dot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 3.5,
    marginLeft: 3,
  },
  dotContainer: {
    paddingTop: 8,
    paddingBottom: 10,
    paddingLeft: 60,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 999,
    top: 0,
    right: 0,
  },
  jumpContainer: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 999,
    top: 0,
    right: 0,
  },
  username: {
    color: '#0E141E',
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
  },
  edited: {
    fontSize: 14,
    letterSpacing: 0.1,
    color: '#8E8E95',
    paddingTop: Platform.OS === 'ios' ? 1.7 : 0,
  },
  timespan: {
    fontSize: Platform.OS === 'ios' ? 14 : 13,
    letterSpacing: 0.1,
    color: '#8E8E95',
    fontFamily: 'SFProDisplay-Regular',
  },
  text: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#191919',
    fontSize: 16,
    letterSpacing: 0.1,
    marginTop: Platform.OS === 'ios' ? 1.7 : 0,
  },
  codeText: {
    fontFamily: 'SFMono-Regular',
    color: '#191919',
    fontSize: 15,
    // letterSpacing: 0.1
  },
  feedbackContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  imageContainer: {
    height: 250,
    width: '100%',
    borderRadius: 4,
    borderColor: '#DCDCDC',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  imageUrlContainer: {
    height: 250,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 4,
    borderColor: '#DCDCDC',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  threadSeparator: {
    marginTop: 5,
    marginLeft: 17,
    width: 3,
    minHeight: 10,
    height: '100%',
    flex: 5,
    borderRadius: 1.5,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
    flex: 0,
  },
  repostProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 4,
    flex: 0,
  },
  optionButton: {
    position: 'absolute',
    top: 0,
    right: '1rem',
    borderRadius: 17,
  },
  linkContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    marginTop: 10,
    flexDirection: 'row-reverse',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    height: '100%',
  },
  textLink: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#585C63',
    fontSize: 15,
    letterSpacing: 0.1,
  },
});
