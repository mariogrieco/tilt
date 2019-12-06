import concat from 'lodash/concat';
import {
  GET_FOLLOW_TIMELINE_SUCESS,
  GET_FOLLOW_TIMELINE_ERROR,
} from '../actions/follow';

const initialState = {
  post_entities: [],
  posts_ids: [],
};

const followingTimeline = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOLLOW_TIMELINE_SUCESS:
      return {
        post_entities: concat(
          state.post_entities,
          action.payload.post_entities,
        ),
        posts_ids: concat(state.posts_ids, action.payload.posts_ids),
      };

    default:
      return state;
  }
};

export default followingTimeline;
