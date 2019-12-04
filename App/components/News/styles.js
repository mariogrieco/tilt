import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  title: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
    marginRight: 10,
  },
  span: {
    color: '#585c63',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 14,
    marginTop: 10,
  },
  left: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  image: {
    height: 100,
    width: 100,
  },
  right: {
    flex: 0.5,
    borderRadius: 8,
  },
});
