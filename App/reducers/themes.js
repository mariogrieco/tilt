import {CHANGE_THEME_REQUEST} from '../actions/themeManager';

const initialState = {
  dark: {
    colorPrimary: '#FFFF',
    colorLight: '#585c63',
    green: '#17C491',
    red: '#FC3E30',
    backgroundPrimary: '#040D14',
    buttonTextColor: '#040d14',
    borderBottomColor: '#353942',
    headerTintColor: '#FFF',
  },
  light: {
    colorPrimary: '#0e141e',
    colorLight: '#585c63',
    green: '#17C491',
    red: '#FC3E30',
    backgroundPrimary: '#FFFF',
    buttonTextColor: '#FFF',
    borderBottomColor: '#DCDCDC',
    headerTintColor: '#0E141E',
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
