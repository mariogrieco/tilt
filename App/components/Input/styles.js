import StyleSheet from 'react-native-extended-stylesheet';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingBottom: ifIphoneX(0, 10),
    // paddingTop: Platform.OS === 'ios' ? 15 : 10,
    borderTopColor: '#DCDCDC',
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff'
  },
  mentions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 0,
    paddingBottom: 0
  },
  mentionsProfileImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    flex: 0
  },
  mentionsColor: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  input: {
    paddingLeft: 8,
    paddingRight: 15,
    paddingBottom: 0,
    fontSize: 16,
    letterSpacing: 0.1,
  },
  inputPicture: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
  commandTagContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10
  },
  commandContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 10
  },
  commandExec: {
    flex: 2,
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
    // textTransform: 'low'
  },
  commandDescription: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
  },
  hashTag: {
    flex: 2,
    color: '#0e141e',
    fontFamily: 'SFProDisplay',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  rightElements: {
    flex: Platform.OS === 'android' ? 0.55 : 0.44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 15,
    marginTop: -5
  },
  leftElements: {
    flex: 0.225,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
    marginTop: -5
  },
  inputOption: {
    paddingLeft: '0.625rem',
    paddingRight: '0.625rem'
  },
  showOptionsView: {
    height: 180,
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notShowOptionsView: {
    height: 0
  },
  button: {
    width: '4rem',
    textAlign: 'center',
    backgroundColor: '#017AFE',
    paddingTop: '0.3rem',
    paddingBottom: '0.3rem',
    color: 'white',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    borderRadius: 14.5,
    overflow: 'hidden',
    borderWidth: 1.25,
    borderColor: 'transparent'
  },
  disabled: {
    color: '#585C63',
    borderWidth: 1,
    borderColor: '#585C63',
    backgroundColor: 'white'
  },
  mediaContainer: {
    position: 'relative',
    paddingTop: 10,
    paddingBottom: 10
  },
  mediaPlaceHolder: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mediaUpload: {
    marginTop: 10,
    marginLeft: 15,
    height: 60,
    width: 60,
    marginRight: 15,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteMedia: {
    position: 'absolute',
    right: '2.5%',
    top: '8%'
  },
  documentContainer: {
    padding: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
    marginVertical: 10,
    position: 'relative'
  },
  deleteDocument: {
    position: 'absolute',
    right: '-3.7%',
    top: '-27%'
  },
  documentName: {
    color: '$textColor',
    fontFamily: 'SFProDisplay-SemiBold',
    fontSize: 15,
    letterSpacing: 0.1
  }
});
