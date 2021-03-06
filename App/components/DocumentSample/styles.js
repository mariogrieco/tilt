import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  documentContainer: {
    paddingVertical: 15,
    paddingLeft: 15,
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: 80,
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  documentName: {
    color: '$textColor',
    fontFamily: 'SFProDisplay-SemiBold',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  downloadIconContainer: {
    padding: 15,
  },
});
