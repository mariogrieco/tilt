import {
  GET_FOLLOWS_FOR_FOCUS_USER_ERROR,
  GET_FOLLOWS_FOR_FOCUS_USER_SUCCESS,
} from '../actions/follow';

const initialState = {
  followers: [],
  following: [],
  error: null,
};

const currentFollowUserData = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOWS_FOR_FOCUS_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_FOLLOWS_FOR_FOCUS_USER_ERROR:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default currentFollowUserData;
