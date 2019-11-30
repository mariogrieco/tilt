import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    minHeight: 80,
    paddingHorizontal: 15,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 13,
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
    marginTop: 10,
  },
  left: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  image: {
    minHeight: 80,
    width: 100,
    borderRadius: 6,
  },
  right: {
    flex: 0.5,
    borderRadius: 6,
    marginLeft: '5%',
  },
});
