import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  title: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay',
    fontSize: 16,
  },
  span: {
    color: '#585c63',
    fontFamily:'SFProDisplay',
    fontSize: 14,
  },
  left: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  image: {
    height: 80,
    width: 100,
    borderRadius: 6,
  },
  right: {
    flex: 0.5,
    borderRadius: 6,
    marginLeft: '5%',
  },
});
