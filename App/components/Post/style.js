import StyleSheet from 'react-native-extended-stylesheet';
import Platform from 'react-native';

export default StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  url: {
    color: '#017AFE'
  },
  mentions: {
    color: '#017AFE',
    backgroundColor: '#E4EFFF',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1
  },
  bullishText: {
    color: '#17C491',
    backgroundColor: 'rgba(23, 196, 145, 0.1)',
    fontFamily: 'SFProDisplay-Medium',
    textTransform: 'capitalize'
  },
  bearishText: {
    color: '#FC3E30',
    backgroundColor: 'rgba(252, 62, 48, 0.1)',
    fontFamily: 'SFProDisplay-Medium',
    textTransform: 'capitalize'
  },
  boldText: {
    fontFamily: 'SFProDisplay-Bold'
  },
  mediumText: {
    fontFamily: 'SFProDisplay-Medium'
  },
  italicText: {
    fontFamily: 'SFProDisplay-Italic'
  },
  boldItalicText: {
    fontFamily: 'SFProDisplay-BoldItalic'
  },
  emailText: {
    color: '#017AFE',
  },
  channelPatter: {
    color: '#017AFE',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1
  },
  thumbnails: {
    width: '6.25rem',
    height: '3rem',
    margin: '3.2rem',
    borderRadius: '3.2rem',
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
  thumbnailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  systemText: {
    color: '#8E8E95',
    fontFamily: 'SFProDisplay-Light'
  },
  dot: {
    width: 3.5,
    height: 3.5,
    backgroundColor: '#0e141e',
    borderRadius: 3.5,
    marginLeft: 3
  },
  dotContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 999,
    top: 0,
    right: 0
  },
  jumpContainer: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 999,
    top: 0,
    right: 0
  },
  username: {
    color: '#0E141E',
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
    marginBottom: 4,
  },
  edited: {
    fontSize: 14,
    letterSpacing: 0.1,
    color: '#8E8E95',
    paddingTop: 3.5,
  },
  emojiContainer: {
    paddingTop: 4,
    borderWidth: 0
  },
  emoji: {
    width: 22,
    height: 22,
    borderWidth: 0,
    shadowColor: 'rgba(0,0,0, .2)',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0, //default is 1
    shadowRadius: 0, //default is 1,
    elevation: 0
  },
  timespan: {
    fontSize: 13,
    letterSpacing: 0.1,
    color: '#8E8E95',
    fontFamily: 'SFProDisplay-Regular',
  },
  text: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#191919',
    fontSize: 16,
    letterSpacing: 0.1,
    flexDirection:'row',
    flexWrap:'wrap'
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
    alignItems: 'stretch',
    paddingTop: 10,
    paddingBottom: '0.5rem',
    flexWrap: 'wrap'
    // paddingLeft: '0.9375rem',
    // paddingRight: '1rem',
  },
  imageContainer: {
    height: '15rem',
    width: '100%',
    borderRadius: '0.3125rem',
    borderColor: '#DCDCDC',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  imageUrlContainer: {
    paddingTop: 10,
    height: '15rem',
    width: '100%',
    borderRadius: '0.3125rem',
    borderColor: '#DCDCDC',
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  rightSide: {
    paddingTop: 10,
    width: '85.5%'
  },
  leftSideContainer: {
    paddingTop: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 0
  },
  threadSeparator: {
    // marginTop: 5,
    width: 3,
    height: 10,
    backgroundColor: '#EBEBEB',
    flex: 3
  },
  profileImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    flex: 0
  },
  optionButton: {
    position: 'absolute',
    top: 0,
    right: '1rem',
    borderRadius: 17
  },
  linkContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    borderLeftWidth: 3,
    marginTop: 10,
    flexDirection: 'row-reverse',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingLeft: 0
  },
  textLink: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#585C63',
    fontSize: 15,
    letterSpacing: 0.1
  },
});