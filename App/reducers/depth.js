import {
  FETCH_DEPTH_DATA,
  RESET_DEPTH_CHART,
  DEPTH_CHART_ACTIVE,
  DEPTH_CHART_INACTIVE,
} from '../actions/depth';

const initialState = {
  graph: {
    asks: [{x: 0, y: 0}],
    bids: [{x: 0, y: 0}],
  },
  books: [
    {
      ask: {
        price: 0,
        qty: 0,
      },
      bids: {
        price: 0,
        qty: 0,
      },
    },
  ],
  hasData: false,
  isDepthChartActive: false,
};

const depth = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DEPTH_DATA:
      return {
        ...state,
        ...action.payload,
        hasData: true,
      };
    case RESET_DEPTH_CHART:
      return {...initialState};
    case DEPTH_CHART_ACTIVE:
      return {...state, isDepthChartActive: true};
    case DEPTH_CHART_INACTIVE:
      return {...state, isDepthChartActive: false};
    default:
      return state;
  }
};

export default depth;
