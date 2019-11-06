import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  footer: {
    position: 'absolute',
    height: 100,
    left: 0,
    bottom: 0,
    right: 0,
    paddingHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
  },
  footerText: {
    fontFamily: 'SFProDisplay-bold',
    color: '$textColor',
    fontSize: 16,
    paddingTop: 12,
    paddingBottom: 15,
    textAlign: 'center',
  },
  footerButton: {
    borderRadius: 22,
    height: 44,
    width: '100%',
    backgroundColor: '$green',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 11,
  },
  footerBottonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'SFProDisplay-Medium',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separatorText: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 14,
  },
});
