import {
  GET_POST_THREAD_SUCCESS,
  // GET_POST_THREAD_ERROR
} from '../actions/posts';

const initialState = [];

const threads = (state = initialState, action) => {
  switch (action.type) {
    case GET_POST_THREAD_SUCCESS: {
      const nextState = [...state];
      nextState.push(action.payload);
      return nextState;
    }
    default:
      return state;
  }
};

export default threads;
