import {CHANGE_THEME_REQUEST} from '../actions/themeManager';

const initialState = {
  light: {
    primaryBackgroundColor: '#FFFF',
    secondaryBackgroundColor: '#F6F7F9',
    primaryTextColor: '#0E141E',
    secondaryTextColor: '#585C63',
    tiltGreen: '#17C491',
    tiltRed: '#FC3E30',
    buttonTextColor: '#FFF',
    borderBottomColor: '#DCDCDC',
    headerTintColor: '#0E141E',
  },
  dark: {
    primaryBackgroundColor: '#040D14',
    secondaryBackgroundColor: '#0E141E',
    primaryTextColor: '#FFFF',
    secondaryTextColor: '#585C63',
    tiltGreen: '#17C491',
    tiltRed: '#FC3E30',
    buttonTextColor: '#040D14',
    borderBottomColor: '#353942',
    headerTintColor: '#FFF',
  },
  current: 'light',
};

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME_REQUEST:
      console.log('llamado de nuevo cambio de tema');
      return {
        ...state,
        current: state.current === 'light' ? 'dark' : 'light',
      };
    default:
      return state;
  }
};

export default themeReducer;
