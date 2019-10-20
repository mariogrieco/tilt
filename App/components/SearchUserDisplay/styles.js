import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    paddingLeft: 15,
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 6
  },
  image: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingLeft: 15
  },
  text: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
    color: '$textColor'
  }
});
