import StyleSheet from 'react-native-extended-stylesheet';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  chart: {
    flex: 1,
    padding: 0,
    marginTop: 15,
    zIndex: -9999,
  },
  controls: {
    flexDirection: 'row',
    paddingLeft: '0.9375rem',
    paddingRight: '0.8125rem',
    justifyContent: 'space-between',
  },
  row: {
    paddingLeft: '0.9375rem',
    paddingRight: '0.8125rem',
  },
});
