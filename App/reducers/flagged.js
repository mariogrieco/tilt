import {
  GET_FLAGGED_SUCESS,
  SET_FLAGGED_SUCESS,
  // GET_FLAGGED_ERROR
} from '../actions/flagged';
import {LOGOUT_SUCESS} from '../actions/login';

// import {
//  SET_NEW_FLAG_ERROR,
//  SET_NEW_FLAG_SUCCESS
// } from '../actions/posts'

const initialState = {
  order: [],
  posts: {},
};

const flagged = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_SUCESS: {
      return {
        order: [],
        posts: {},
      };
    }
    case SET_FLAGGED_SUCESS: {
      const nextState = {...state};
      const newFlag = action.payload[0];
      nextState.order.push(newFlag.name);
      nextState.posts[newFlag.id] = newFlag;
      return nextState;
    }
    case GET_FLAGGED_SUCESS:
      return action.payload;
    // case SET_NEW_FLAG_SUCCESS:
    default:
      return state;
  }
};

export default flagged;
