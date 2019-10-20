import {
  // SEARCH_POSTS_WITH_PARAMS_ERROR,
  SEARCH_POSTS_WITH_PARAMS_SUCCESS,
  JUMP_TO_ACTION_SUCCESS,
  JUMP_TO_ACTION_CLEAR
} from '../actions/advancedSearch';
import {
  SET_ACTIVE_FOCUS_CHANNEL_ID
} from '../actions/advancedSearch';

import cloneDeep from 'lodash/cloneDeep';

const initialState = {
  posts: {},
  order: [],
  matches: null,
  jumpPosts: {
    order: [],
    posts: {},
    channel_id: null
  },
  activeJump: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ACTIVE_FOCUS_CHANNEL_ID:
    case JUMP_TO_ACTION_CLEAR: {
      return {
        ...cloneDeep(state),
        activeJump: false,
        jumpPosts: {
          order: [],
          posts: {},
          channel_id: null
        }
      }
    }
    case JUMP_TO_ACTION_SUCCESS: {
      return {
        ...cloneDeep(state),
        activeJump: true,
        jumpPosts: {
          order: payload.order,
          posts: payload.posts,
          channel_id: payload.channel_id
        }
      }
    }
    case SEARCH_POSTS_WITH_PARAMS_SUCCESS:
      return { ...cloneDeep(state), ...payload };
    default:
      return state;
  }
};
