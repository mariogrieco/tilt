import {GET_NEWS_FOR_SYMBOL_SUCCESS} from '../actions/newsActions';

const initialState = {};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_NEWS_FOR_SYMBOL_SUCCESS:
      return {...state, [payload.symbol]: payload.data};
    default:
      return state;
  }
};
