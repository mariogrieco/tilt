import {GET_FEEDS_SUCCESS} from '../actions/feeds';

const initialState = {
  channels: {},
  channels_keys: [],
  posts: {},
  posts_keys: [],
};

const feesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_FEEDS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default feesReducer;
