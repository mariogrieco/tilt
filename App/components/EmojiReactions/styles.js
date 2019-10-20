import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  emojiReactionsText: {
    color: '#0E141E',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 13,
    letterSpacing: 0.1,
  },
  emojiReactions: {
    borderRadius: 16,
    backgroundColor: '#F6F7F9',
    borderColor: '#D9D8D7',
    borderWidth: StyleSheet.hairlineWidth,
    width: 54,
    height: 32,
    padding: 4,
    marginRight: 6,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  borderLess: {
    borderWidth: 0,
    borderColor: 'transparent'
  },
});
