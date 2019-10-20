import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    paddingTop: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '0.9375rem',
    paddingRight: '1rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  shortContainer: {
    paddingTop: '1rem',
    paddingBottom: '0.35rem',
    paddingLeft: '0.9375rem',
    paddingRight: '1rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  shortTitle: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Black',
  },
  title: {
    fontSize: 18,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Black',
  },
  span: {
    color: '#585C63',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  blue: {
    color: '#007aff'
  },
  orange: {
    color: '#FF9500',
  },
  purple: {
    color: '#5856d6'
  },
  black: {
    color: '#434343'
  },
  join: {
    width: 60,
    height: 24,
    borderRadius: '1.375rem',
    backgroundColor: '#17C491',
    justifyContent: 'center',
    alignItems: 'center'
  },
  joinText: {
    color: 'white',
    fontSize: 15,
    letterSpacing: 0.1,
  }
});
