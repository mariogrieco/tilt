import {
  SHOW_POST_ACTIONS,
  HIDE_POST_ACTIONS,
  RESET_POST_ACTIONS
} from '../actions/posts';

const initialState = {
  display: false,
  userId: '',
  postId: '',
  options: {
    hideReply: false,
  }
};

const postActions = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POST_ACTIONS:
      return action.payload;
    case HIDE_POST_ACTIONS:
      return { ...state, display: false };
    case RESET_POST_ACTIONS:
      return initialState;
    default:
      return state;
  }
};

export default postActions;
