import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  emojiReactionsText: {
    color: '#0E141E',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 13,
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  },
  emojiReactions: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    width: 58,
    height: 32,
    padding: 4,
    marginRight: 6,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  borderLess: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
});
