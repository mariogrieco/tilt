import Client4 from '../api/MattermostClient';
import {PER_PAGE_DEFAULT} from '../api/globals';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

export const SEARCH_POSTS_WITH_PARAMS_SUCCESS =
  'SEARCH_POSTS_WITH_PARAMS_SUCCESS';
export const SEARCH_POSTS_WITH_PARAMS_ERROR = 'SEARCH_POSTS_WITH_PARAMS_ERROR';

export const JUMP_TO_ACTION_SUCCESS = 'JUMP_TO_ACTION_SUCCESS';
export const JUMP_TO_ACTION_ERROR = 'JUMP_TO_ACTION_ERROR';

export const JUMP_TO_ACTION_CLEAR = 'JUMP_TO_ACTION_CLEAR';

export const jumpToAction = (
  channelId,
  postId,
  page,
  perPage = PER_PAGE_DEFAULT,
) => async (dispatch, getState) => {
  try {
    const currentPost = cloneDeep(getState().advancedSearch.posts[postId]);
    const result = {
      order: [],
      posts: {},
      channel_id: channelId,
    };

    const [postsAfter, postsBefore] = await Promise.all([
      Client4.getPostsAfter(channelId, postId, page, PER_PAGE_DEFAULT),
      Client4.getPostsBefore(channelId, postId, page, PER_PAGE_DEFAULT),
    ]);

    if (currentPost) {
      postsAfter.posts[postId] = currentPost;
      postsAfter.order.push(postId);
    }

    result.order = postsAfter.order.concat(postsBefore.order);

    merge(result.posts, postsBefore.posts);
    merge(result.posts, postsAfter.posts);

    dispatch(jumpToActionSuccess(result));
    return result;
  } catch (ex) {
    dispatch(jumpToActionError(ex));
    return Promise.reject(ex.message);
  }
};

export const jumpToActionSuccess = result => ({
  type: JUMP_TO_ACTION_SUCCESS,
  payload: result,
});

export const jumpToActionError = err => ({
  type: JUMP_TO_ACTION_ERROR,
  payload: err,
});

export const clearjumpToAction = message => ({
  type: JUMP_TO_ACTION_CLEAR,
  payload: message,
});

export const searchPostsWithParams = (queryStr, page) => async (
  dispatch,
  getState,
) => {
  try {
    const teamId = getState().teams.default_team_id;
    const result = await Client4.searchPostsWithParams(teamId, {
      terms: queryStr,
      include_deleted_channels: false,
      per_page: 9999999,
      page,
    });
    dispatch(searchPostsWithParamsSuccess(result));
    return result;
  } catch (ex) {
    dispatch(searchPostsWithParamsError(ex));
    return Promise.reject(ex.message);
  }
};

export const searchPostsWithParamsSuccess = result => ({
  type: SEARCH_POSTS_WITH_PARAMS_SUCCESS,
  payload: result,
});

export const searchPostsWithParamsError = err => ({
  type: SEARCH_POSTS_WITH_PARAMS_ERROR,
  payload: err,
});
