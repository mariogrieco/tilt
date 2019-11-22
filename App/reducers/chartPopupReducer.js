import {
  SET_CHART_POPUP_VALUE,
  SET_CHART_POPUP_SYMBOL_VALUE,
  CLOSE_CHART_POPUP,
  OPEN_CHART_POPUP,
} from '../actions/chartPopup';

const initialState = {
  price: 0.0,
  changePercent: 0.0,
  is_chat: true, // Join
  symbol: '',
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CHART_POPUP_SYMBOL_VALUE:
      if (payload.changePercent) {
        payload.changePercent = parseFloat(payload.changePercent).toFixed(2);
      }
      if (payload.price) {
        payload.price = parseFloat(payload.price);
      }
      return {...initialState, ...payload, isActive: true};
    case SET_CHART_POPUP_VALUE:
      return {...initialState, ...payload};
    case OPEN_CHART_POPUP:
      return {...initialState, isActive: true};
    case CLOSE_CHART_POPUP:
      return {...initialState, isActive: false};
    default:
      return state;
  }
};
