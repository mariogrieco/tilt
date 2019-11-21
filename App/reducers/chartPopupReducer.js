import {
  SET_CHART_POPUP_VALUE,
  SET_CHART_POPUP_SYMBOL_VALUE,
  CLOSE_CHART_POPUP,
  OPEN_CHART_POPUP,
} from '../actions/chartPopup';

const initialState = {
  price: '-',
  percent: '-',
  is_chat: true, // Join
  symbol: null,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CHART_POPUP_SYMBOL_VALUE:
      return {...state, ...payload, isActive: true};
    case SET_CHART_POPUP_VALUE:
      return {...state, ...payload};
    case OPEN_CHART_POPUP:
      return {isActive: true};
    case CLOSE_CHART_POPUP:
      return {isActive: false, ...initialState};
    default:
      return state;
  }
};
