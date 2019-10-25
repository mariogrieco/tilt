import {POST_REPLY} from '../actions/reply';

const initialState = {
  postId: '',
  userId: '',
};

const reply = (state = initialState, action) => {
  switch (action.type) {
    case POST_REPLY:
      return action.payload;
    default:
      return state;
  }
};

export default reply;
