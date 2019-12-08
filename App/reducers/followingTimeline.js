import concat from 'lodash/concat';
import {
  GET_FOLLOW_TIMELINE_SUCESS,
  GET_FOLLOW_TIMELINE_ERROR,
  FOLLOW_TIMELINE_LOADING,
  FOLLOW_TIMELINE_DONE,
} from '../actions/follow';

const initialState = {
  post_entities: [],
  posts_ids: [],
  isLoading: false,
  page: 0,
};

const followingTimeline = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOW_TIMELINE_SUCESS:
      const newState = {
        isLoading: state.isLoading,
        post_entities: {
          ...state.post_entities,
          ...action.payload.post_entities,
        },
        posts_ids: concat(state.posts_ids, action.payload.posts_ids),
        page: state.page + 1,
      };
      return newState;
    case FOLLOW_TIMELINE_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case FOLLOW_TIMELINE_DONE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default followingTimeline;
