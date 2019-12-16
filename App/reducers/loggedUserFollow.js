import {
  GET_MY_FOLLOWS_ERROR,
  GET_MY_FOLLOWS_SUCCESS,
  FOLLOW_CHANGE_LOADING,
  FOLLOW_CHANGE_END,
  SET_FOLLOWING_SUCESS,
  SET_UNFOLLOWING_SUCESS,
} from '../actions/follow';

const initialState = {
  followers: [],
  following: [],
  loadingChange: false,
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
    case SET_FOLLOWING_SUCESS:
      return {
        ...state,
        following: [...state.following, action.payload],
      };
    case SET_UNFOLLOWING_SUCESS:
      return {
        ...state,
        following: state.following.filter(id => id !== action.payload),
      };
    case FOLLOW_CHANGE_LOADING:
      return {
        ...state,
        loadingChange: true,
      };
    case FOLLOW_CHANGE_END:
      return {
        ...state,
        loadingChange: false,
      };
    default:
      return state;
  }
};

export default followReducer;
