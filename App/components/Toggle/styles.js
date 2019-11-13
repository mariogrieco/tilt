import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    height: '1.813rem',
    backgroundColor: '#F6F7F9',
    alignItems: 'center',
    borderRadius: '0.875rem',
  },
  toggleText: {
    paddingLeft: '1.313rem',
    paddingRight: '1.5rem',
    fontSize: 16,
    letterSpacing: 0.1,
    paddingTop: '0.25rem',
    paddingBottom: '0.375rem',
    fontFamily: 'SFProDisplay-Medium',
  },
  toggleSelected: {
    backgroundColor: '#17C491',
    color: '#fff',
    borderRadius: '0.875rem',
    overflow: 'hidden',
  },
  toggleUnSelected: {
    color: '#0e141e',
    // paddingLeft: '0.625rem'
  },
});
