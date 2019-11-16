import {GET_FEES_SUCCESS} from '../actions/fees';

const initialState = {
  channels: {},
  channels_keys: [],
  posts: {},
  posts_keys: [],
};

const feesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FEES_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default feesReducer;
