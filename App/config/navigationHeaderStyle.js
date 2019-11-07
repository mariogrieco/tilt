import StyleSheet from 'react-native-extended-stylesheet';
import merge from 'lodash/merge';

const headerScreenStyles = {
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
    backgroundColor: '#FFF',
  },
  headerTitleStyle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'SFProDisplay-Bold',
    // letterSpacing: -0.43
  },
  headerTintColor: '#0E141E',
};

export const headerForScreenWithBottomLine = (customStyles = {}) =>
  merge({}, headerScreenStyles, customStyles);

const headerForScreenWithTabsStyle = {
  headerStyle: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 0,
    backgroundColor: '#FFFF',
  },
  headerTitleStyle: {
    fontSize: 18,
    fontFamily: 'SFProDisplay-Bold',
  },
  headerTintColor: '#0E141E',
};

export const headerForScreenWithTabs = (customStyles = {}) =>
  merge({}, headerForScreenWithTabsStyle, customStyles);
