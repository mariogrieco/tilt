import { 
  SELECTED_SYMBOL, 
  FETCH_SYMBOLS,
  FETCH_CRYPTOS_ERROR
} from '../actions/symbols';

const initialState = {
  ticker: [],
  selectedSymbol: null,
  hasData: false,
  err: null
};

const watchlist = (state = initialState, action) => {
  switch (action.type) {
    case `WATCHLIST_${FETCH_SYMBOLS}`:
      return {
        ...state,
        ticker: action.payload,
        hasData: true,
        err: null
      };
    case `CHART_${FETCH_SYMBOLS}`:
      return {
        ...state,
        selectedSymbol: action.payload
      };
    case SELECTED_SYMBOL:
      return {
        ...state,
        selectedSymbol: action.payload
      };
    case FETCH_CRYPTOS_ERROR:
      return {
        ...state,
        ticker: [],
        err: action.payload,
        hasData: false
      };
    default:
      return state;
  }
};

export default watchlist;
