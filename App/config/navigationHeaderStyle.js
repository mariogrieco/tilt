import StyleSheet from 'react-native-extended-stylesheet';

export const stackHeader = {
  headerStyle: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    shadowColor: '#D9D8D7',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    backgroundColor: '#fff'
  },
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'SFProDisplay-Bold'
    // letterSpacing: -0.43
  },
  headerTintColor: '#0E141E'

};

export const headerForScreenWithTabs = {

  headerStyle: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 0,
    backgroundColor: '#FFF'
  },
  headerTitleStyle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Bold',
  },
  headerTintColor: '#0e141e'
};
