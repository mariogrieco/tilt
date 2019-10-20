import {
  // GET_STATUSES_ERROR,
  GET_STATUSES_SUCCESS,
  STATUSES_CHANGE,
} from '../actions/statuses';

const initialState = {
  data: {},
  keys: [],
};

const statuses = (state = initialState, action) => {
  switch (action.type) {
    case STATUSES_CHANGE: {
      let nextState = {...state};
      if (nextState.data[action.payload.user_id]) {
        nextState.data[action.payload.user_id] = {
          ...nextState.data[action.payload.user_id],
          status: action.payload.status,
        };
      }
      return nextState;
    }
    case GET_STATUSES_SUCCESS:
      let nextState = {...state};
      action.payload.forEach(element => {
        nextState.data[element.user_id] = element;
      });
      nextState.keys = Object.keys(nextState.data);
      return nextState;
    default:
      return state;
  }
};

export default statuses;
