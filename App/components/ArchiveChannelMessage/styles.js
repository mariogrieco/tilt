import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    borderTopColor: '#DCDCDC',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: '7.625rem',
  },
  textContainer: {
    width: '20rem',
    marginLeft: '2.3rem',
  },
  textInfo: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#0e141e',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  button: {
    backgroundColor: '#17C491',
    width: '23rem',
    height: '2.75rem',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: 'white',
    textAlign: 'center',
    borderTopLeftRadius: '$borderRadius',
    borderBottomLeftRadius: '$borderRadius',
    borderTopRightRadius: '$borderRadius',
    borderBottomRightRadius: '$borderRadius',
    marginTop: '0.5rem',
    marginLeft: '0.9375rem',
    marginRight: '0.9375rem',
    padding: '0.5rem',
  },
});
