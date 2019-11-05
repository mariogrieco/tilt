import {CHANGE_THEME_REQUEST} from '../actions/themeManager';

const initialState = 'light';

const themeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_THEME_REQUEST:
      return state === 'light' ? 'dark' : 'light';
    default:
      return initialState;
  }
};

export default themeReducer;
