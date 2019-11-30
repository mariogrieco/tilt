import {GET_MY_FOLLOWS_ERROR, GET_MY_FOLLOWS_SUCCESS} from '../actions/follow';

const initialState = {
  followers: [],
  following: [],
  error: null,
};

const followReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_FOLLOWS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_MY_FOLLOWS_ERROR:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default followReducer;
