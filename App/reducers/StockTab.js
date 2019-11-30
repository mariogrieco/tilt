import {
  GET_ACTIVE_MARKET_LIST_SUCCESS,
  GET_GAINERS_MARKET_LIST_SUCCESS,
  GET_LOSERS_MARKET_LIST_SUCCESS,
} from '../actions/StockTabActions';

const initialState = {
  gainers: [{
    symbol: 'A',
  }],
  losers: [],
  actives: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_ACTIVE_MARKET_LIST_SUCCESS:
      return {...state, actives: payload};
    case GET_LOSERS_MARKET_LIST_SUCCESS:
      return {...state, losers: payload};
    // case GET_GAINERS_MARKET_LIST_SUCCESS:
      // return {...state, gainers: payload};
    default:
      return state;
  }
};
