import _ from 'lodash';
import {FETCH_MINICHART} from '../actions/miniChart';

const initialState = [];

const miniChart = (state = initialState, action) => {
  const newSymbol = {};
  let newState = {};

  switch (action.type) {
    case FETCH_MINICHART:
      newSymbol[action.payload.symbol] = action.payload.data;
      newState = _.assign({...state}, newSymbol);
      return newState;
    default:
      return state;
  }
};

export default miniChart;
