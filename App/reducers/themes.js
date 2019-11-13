import {CHANGE_THEME_REQUEST} from '../actions/themeManager';
import Platform from 'react-native';

const initialState = {
  light: {
    primaryBackgroundColor: '#FFFF',
    secondaryBackgroundColor: '#F6F7F9',
    primaryTextColor: '#0E141E',
    secondaryTextColor: '#585C63',
    placeholderTextColor: '#8E8E93',
    tiltGreen: '#17C491',
    tiltRed: '#FC3E30',
    buttonTextColor: '#FFF',
    borderBottomColor: '#DCDCDC',
    mediaBorderColor: '#DCDCDC',
    headerTintColor: '#0E141E',
    emojiReactionsBackgroundColor: '#F6F7F9',
    emojiReactionsBorderBackgroundColor: '#D9D8D7',
    threadSeparatorColor: '#EBEBEB',
    intervalSelectedTextColor: '#FFF',
    intervalUnselectedTextColor: '#17C491',
    intervalSelectedBackgroundColor: '#17C491',
    intervalUnselectedBackgroundColor: '#FFF',
    modalPopupBackgroundColor: '#FFF',
    codeBackgroundColor: '#F4F4F4',
    userMentionBackgroundColor: '#E4EFFF',
    joinButtonBackgroundColor: '#EBEBEB',
    barStyleColor: 'dark-content',
  },
  dark: {
    primaryBackgroundColor: '#040D14',
    secondaryBackgroundColor: '#0E141E',
    primaryTextColor: '#FFFF',
    secondaryTextColor: '#585C63',
    placeholderTextColor: '#8E8E93',
    tiltGreen: '#17C491',
    tiltRed: '#FC3E30',
    buttonTextColor: '#040D14',
    borderBottomColor: '#353942',
    mediaBorderColor: '#353942',
    headerTintColor: '#FFF',
    emojiReactionsBackgroundColor: '#1e242e',
    emojiReactionsBorderBackgroundColor: '#1e242e',
    threadSeparatorColor: '#1e242e',
    intervalSelectedTextColor: '#0E141E',
    intervalUnselectedTextColor: '#17C491',
    intervalSelectedBackgroundColor: '#17C491',
    intervalUnselectedBackgroundColor: '#040D14',
    modalPopupBackgroundColor: '#0E141E',
    codeBackgroundColor: 'rgba(244,244,244,0.1)',
    userMentionBackgroundColor: 'rgba(228,239,255,0.2)',
    joinButtonBackgroundColor: 'rgba(235,235,235,0.1)',
    barStyleColor: 'light-content',
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
