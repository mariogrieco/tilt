import moment from 'moment';
import Client4 from '../api/MattermostClient';
import {
  verifyChannelUpdates,
  // getLastViewForChannelsSucess
} from './channels';
import {PER_PAGE_DEFAULT} from '../api/globals';

export const GET_POST = 'GET_POST';
export const GET_POST_SUCESS = 'GET_POST_SUCESS';

export const GET_POST_ERROR = 'GET_POST_ERROR';
export const GET_POST_FOR_CHANNEL_ID = 'GET_POST_FOR_CHANNEL_ID';

export const GET_POST_FOR_CHANNEL_SUCCESS = 'GET_POST_FOR_CHANNEL_SUCCESS';
export const GET_POST_FOR_CHANNEL_ERROR = 'GET_POST_FOR_CHANNEL_ERROR';

export const SET_NEW_FLAG_SUCCESS = 'SET_NEW_FLAG_SUCCESS';
export const SET_NEW_FLAG_ERROR = 'SET_NEW_FLAG_ERROR';

export const ADD_POST_TO_SUCCESS = 'ADD_POST_TO_SUCCESS';
export const ADD_POST_TO_ERROR = 'ADD_POST_TO_ERROR';

export const REMOVE_FROM_POST_SUCCESS = 'REMOVE_FROM_POST_SUCCESS';
export const REMOVE_FROM_POST_ERROR = 'REMOVE_FROM_POST_ERROR';

export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';
export const EDIT_POST_ERROR = 'EDIT_POST_ERROR';

export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR = 'CREATE_POST_ERROR';

export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_ERROR = 'DELETE_POST_ERROR';

export const GET_POST_THREAD_SUCCESS = 'GET_POST_THREAD_SUCCESS';
export const GET_POST_THREAD_ERROR = 'GET_POST_THREAD_ERROR';

export const UPDATE_POST_SUCCESS = 'UPDATE_POST_SUCCESS';
export const UPDATE_POST_ERROR = 'UPDATE_POST_ERROR';

export const SHOW_POST_ACTIONS = 'SHOW_POST_ACTIONS';
export const HIDE_POST_ACTIONS = 'HIDE_POST_ACTIONS';
export const RESET_POST_ACTIONS = 'RESET_POST_ACTIONS';

export const SHOW_POST_MEDIA_BOX = 'SHOW_POST_MEDIA_BOX';
export const HIDE_POST_MEDIA_BOX = 'HIDE_POST_MEDIA_BOX';
export const CLOSED_POST_MEDIA_BOX = 'CLOSED_POST_MEDIA_BOX';

export const REMOVE_POST_REDUCER_BY_CHANNEL_ID = 'REMOVE_POST_REDUCER_BY_CHANNEL_ID';

export const removePostFromChannelId = channel_id => ({
  type: REMOVE_POST_REDUCER_BY_CHANNEL_ID,
  payload: channel_id,
});

function getFlagSchema(postId, userId) {
  return [
    {
      category: 'flagged_post',
      name: postId,
      user_id: userId,
      value: 'true',
    },
  ];
}

function getCreatePostSchema(
  message,
  user_id,
  update_at,
  channel_id,
  root_id,
  file_ids,
) {
  return {
    channel_id,
    create_at: 0,
    file_ids: file_ids || [],
    message,
    pending_post_id: `${user_id}:${update_at - 1}`,
    update_at,
    user_id,
    root_id,
    parent_id: root_id,
  };
}

export const showPostActions = (userId, postId, options = {}) => ({
  type: SHOW_POST_ACTIONS,
  payload: {
    display: true,
    userId,
    postId,
    options,
  },
});

export const hidePostActions = () => ({
  type: HIDE_POST_ACTIONS,
});

export const resetPostActions = () => ({
  type: RESET_POST_ACTIONS,
});

export const showPostMediaBox = ({uri, type, id}) => dispatch =>
  dispatch({
    type: SHOW_POST_MEDIA_BOX,
    payload: {
      uri,
      type,
      id,
    },
  });

export const hidePostMediaBox = () => ({
  type: HIDE_POST_MEDIA_BOX,
});

export const closedPostMediaBox = () => ({
  type: CLOSED_POST_MEDIA_BOX,
});

export const updatePost = post => async dispatch => {
  try {
    const result = await Client4.updatePost(post);
    dispatch(updatePostSucess(result));
    return post;
  } catch (ex) {
    dispatch(updatePostError(ex));
    return Promise.reject(ex.message);
  }
};

export const updatePostSucess = post => ({
  type: UPDATE_POST_SUCCESS,
  payload: post,
});

export const updatePostError = err => ({
  type: UPDATE_POST_ERROR,
  payload: err,
});

export const createPost = (message, channelId, root_id, file_ids) => async (
  dispatch,
  getState,
) => {
  root_id = root_id || '';
  try {
    const meId = getState().login.user.id;
    const post = getCreatePostSchema(
      message,
      meId,
      moment().unix(),
      channelId,
      root_id,
      file_ids,
    );
    await Client4.createPost(post);
    dispatch(createPostSucess(post));
    return post;
  } catch (ex) {
    dispatch(createPostError(ex));
    return Promise.reject(ex);
  }
};

export const createPostSucess = post => ({
  type: CREATE_POST_SUCCESS,
  payload: post,
});

export const createPostError = err => ({
  type: CREATE_POST_ERROR,
  payload: err,
});

export const getPostThreads = () => async (dispatch, getState) => {
  // try {
  //   const posts = [];
  //   getState().posts.forEach(post => {
  //     post.order.forEach(id => {
  //       posts.push(id)
  //     })
  //   });
  //   for (const id of posts) {
  //     const postThread = await Client4.getPostThread(id);
  //     dispatch(getPostThreadsSucess(postThread));
  //   }
  //   return posts;
  // } catch (ex) {
  //   dispatch(getPostThreadsError(ex.message));
  //   return Promise.reject(ex.message);
  // }
};

export const getPostThreadsSucess = postThread => ({
  type: GET_POST_THREAD_SUCCESS,
  payload: postThread,
});

export const getPostThreadsError = err => ({
  type: GET_POST_THREAD_ERROR,
  payload: err,
});

export const deletePost = postId => async dispatch => {
  try {
    const result = await Client4.deletePost(postId);
    dispatch(deletePostSucess(result));
    return result;
  } catch (ex) {
    dispatch(deletePostError(ex));
    return Promise.reject(ex.message);
  }
};

export const deletePostSucess = post => ({
  type: DELETE_POST_SUCCESS,
  payload: post,
});

export const deletePostError = err => ({
  type: DELETE_POST_ERROR,
  payload: err,
});
// END DELETE

export const editPost = post => async (dispatch, getState) => {
  try {
    // const currentId = getState().appNavigation.active_channel_id;
    // if (currentId === post.channel_id) {
    //   dispatch(getLastViewForChannelsSucess({
    //     [post.channel_id]: post.edit_at
    //   }));
    // } else {
    // dispatch(getLastViewForChannelsSucess({
    //   [post.channel_id]: post.edit_at
    // }));
    // }
    dispatch(editPostSucess(post));
    return post;
  } catch (ex) {
    dispatch(editPostError(ex));
    return Promise.reject(ex.message);
  }
};

export const editPostSucess = post => ({
  type: EDIT_POST_SUCCESS,
  payload: post,
});

export const editPostError = err => ({
  type: EDIT_POST_ERROR,
  payload: err,
});

export const removeFromPost = post => async dispatch => {
  try {
    dispatch(removeFromPostSucess(post));
    return post;
  } catch (ex) {
    dispatch(removeFromPostError(ex));
    return Promise.reject(ex.message);
  }
};

export const removeFromPostSucess = post => ({
  type: REMOVE_FROM_POST_SUCCESS,
  payload: post,
});

export const removeFromPostError = err => ({
  type: REMOVE_FROM_POST_ERROR,
  payload: err,
});

export const addPostTo = post => async (dispatch, getState) => {
  try {
    // const currentId = getState().appNavigation.active_channel_id;
    // if (currentId === post.channel_id) {
    // dispatch(getLastViewForChannelsSucess({
    //   [post.channel_id]: post.create_at
    // }));
    // } else {
    //   dispatch(getLastViewForChannelsSucess({
    //     [post.channel_id]: post.create_at
    //   }));
    // }
    dispatch(addPostToSucess(post));
    dispatch(verifyChannelUpdates(post));
    return post;
  } catch (ex) {
    dispatch(addPostToError(ex));
    return Promise.reject(ex.message);
  }
};

export const addPostToSucess = post => ({
  type: ADD_POST_TO_SUCCESS,
  payload: post,
});

export const addPostToError = err => ({
  type: ADD_POST_TO_ERROR,
  payload: err,
});

export const saveNewFlag = (postId, userId) => async dispatch => {
  try {
    const flagPost = await Client4.savePreferences(
      userId,
      getFlagSchema(postId, userId),
    );
    dispatch(saveNewFlagSucess(flagPost));
    return flagPost;
  } catch (ex) {
    dispatch(saveNewFlagError(ex));
    return Promise.reject(ex.message);
  }
};

export const saveNewFlagSucess = flagPost => ({
  type: SET_NEW_FLAG_SUCCESS,
  // payload: flagPost
});

export const saveNewFlagError = err => ({
  type: SET_NEW_FLAG_ERROR,
  payload: err,
});

export const getPostsBefore = (
  channelId,
  postId,
  page = 0,
  perPage = PER_PAGE_DEFAULT,
) => async dispatch => {
  try {
    const posts = await Client4.getPostsBefore(
      channelId,
      postId,
      page,
      perPage,
    );
    // dispatch(getPostsForChannelSucess([{ ...posts, channel_id: channelId, page: pagination }]));
    return posts;
  } catch (ex) {
    dispatch(getPostsForChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const getPostsAfter = (
  channelId,
  postId,
  page = 0,
  perPage = PER_PAGE_DEFAULT,
) => async dispatch => {
  try {
    const posts = await Client4.getPosts(channelId, postId, page, perPage);
    // dispatch(getPostsForChannelSucess([{ ...posts, channel_id: channelId, page: pagination }]));
    return posts;
  } catch (ex) {
    dispatch(getPostsForChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const getPostsForChannel = (
  channelId,
  pagination = 0,
) => async dispatch => {
  try {
    const posts = await Client4.getPosts(
      channelId,
      pagination,
      PER_PAGE_DEFAULT,
    );
    dispatch(
      getPostsForChannelSucess([
        {...posts, channel_id: channelId, page: pagination},
      ]),
    );
    return posts;
  } catch (ex) {
    dispatch(getPostsForChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const getPostsForChannelSucess = posts => ({
  type: GET_POST_FOR_CHANNEL_SUCCESS,
  payload: posts,
});

export const getPostsForChannelError = err => ({
  type: GET_POST_FOR_CHANNEL_ERROR,
  payload: err,
});

export const getPostsByChannelId = (channels, pagination) => async dispatch => {
  // reset each time the reducer
  try {
    const postsForChannel = [];
    const asyncCalls = [];
    const indexChannel = [];
    let results = [];

    channels.forEach(channel => {
      asyncCalls.push(
        Client4.getPosts(channel.id, pagination, PER_PAGE_DEFAULT),
      );
      indexChannel.push(channel);
    });

    results = await Promise.all(asyncCalls);

    results.forEach((result, index) => {
      postsForChannel.push({
        ...result,
        channel_id: indexChannel[index].id,
        page: 0,
      });
    });

    dispatch(getPostsByChannelIdSucess(postsForChannel));
    return postsForChannel;
  } catch (ex) {
    dispatch(getPostsByChannelIdError(ex));
    return Promise.reject(ex.message);
  }
};

export const getPostsByChannelIdSucess = posts => ({
  type: GET_POST_SUCESS,
  payload: posts,
});

export const getPostsByChannelIdError = err => ({
  type: GET_POST_ERROR,
  payload: err,
});
