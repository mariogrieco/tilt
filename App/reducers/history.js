import {FETCH_TRADE_HISTORIES, RESET_HISTORIES} from '../actions/history';

const initialState = {
  hasData: false,
  data: [],
};

const history = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TRADE_HISTORIES:
      return {
        ...state,
        hasData: true,
        data: action.payload,
      };
    case RESET_HISTORIES:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default history;
