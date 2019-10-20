import { FETCH_CANDLE_DATA, CHANGE_INTERVAL, RESET_CANDLE } from '../actions/candle';

const initialState = {
  data: [
    {
      open: 0,
      close: 0,
      shadowH: 0,
      shadowL: 0,
      volume: 0,
      closeTime: ''
    }
  ],
  selectedInterval: 0
};

const candle = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CANDLE_DATA:
      return { ...state, data: action.payload.data };

    case CHANGE_INTERVAL:
      return { ...state, selectedInterval: action.payload };

    case RESET_CANDLE:
      return { ...initialState };
    default:
      return state;
  }
};

export default candle;
