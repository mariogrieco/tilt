import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  titleText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '$textColor',
  },
  titleContainer: {
    backgroundColor: '#F6F7F9',
  },
  input: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '$textColor',
  },
  descriptionContainer: {
    backgroundColor: '#F6F7F9',
  },
  descriptionText: {
    color: '#8E8E95',
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  fieldContainer: {
    paddingTop: 12,
    paddingBottom: 11,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
});
