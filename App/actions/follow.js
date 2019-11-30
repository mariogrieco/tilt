import Client4 from '../api/MattermostClient';

export const GET_MY_FOLLOWS_SUCCESS = 'GET_MY_FOLLOWS_SUCCESS';
export const GET_MY_FOLLOWS_ERROR = 'GET_MY_FOLLOWS_ERROR';
export const GET_FOLLOWS_FOR_FOCUS_USER_SUCCESS =
  'GET_FOLLOWS_FOR_FOCUS_USER_SUCCESS';
export const GET_FOLLOWS_FOR_FOCUS_USER_ERROR =
  'GET_FOLLOWS_FOR_FOCUS_USER_ERROR';

export const SET_FOLLOWING_SUCESS = 'SET_FOLLOWING_SUCCESS';
export const SET_FOLLOWING_ERROR = 'SET_FOLLOWING_ERROR';
export const SET_UNFOLLOWING_SUCESS = 'SET_UNFOLLOWING_SUCESS';
export const SET_UNFOLLOWING_ERROR = 'SET_UNFOLLOWING_ERROR';
export const FOLLOW_CHANGE_LOADING = 'FOLLOW_CHANGE_LOADING';
export const FOLLOW_CHANGE_END = 'FOLLOW_CHANGE_END';

export const getMyFollows = () => async (dispatch, getState) => {
  try {
    const user_id = getState().login.user ? getState().login.user.id : '';
    const [followers, following] = await Promise.all([
      Client4.getUserFollowers(user_id),
      Client4.getUserFollowings(user_id),
    ]);

    const loggedUserId = getState().login.user ? getState().login.user.id : '';

    dispatch({
      type: GET_MY_FOLLOWS_SUCCESS,
      payload: {
        followers: followers.filter(userId => userId !== loggedUserId),
        following: following.filter(userId => userId !== loggedUserId),
        error: null,
      },
    });
  } catch (error) {
    dispatch({
      type: GET_MY_FOLLOWS_ERROR,
      payload: {
        error,
      },
    });
    console.log(error);
  }
};

export const getFollowsForFocusUser = () => async (dispatch, getState) => {
  try {
    const user_id = getState().users.currentUserIdProfile;
    const [followers, following] = await Promise.all([
      Client4.getUserFollowers(user_id),
      Client4.getUserFollowings(user_id),
    ]);

    dispatch({
      type: GET_FOLLOWS_FOR_FOCUS_USER_SUCCESS,
      payload: {
        followers: followers,
        following: following,
        error: null,
      },
    });
  } catch (error) {
    dispatch({
      type: GET_FOLLOWS_FOR_FOCUS_USER_ERROR,
      payload: {
        error,
      },
    });
    console.log(error);
  }
};

export const setFollow = following_id => async (dispatch, getState) => {
  dispatch({
    type: FOLLOW_CHANGE_LOADING,
  });
  const user_id = getState().login.user ? getState().login.user.id : '';
  try {
    await Client4.followUser({user_id, following_id});
    dispatch({
      type: SET_FOLLOWING_SUCESS,
      payload: following_id,
    });
    dispatch({
      type: FOLLOW_CHANGE_END,
    });
  } catch (err) {
    dispatch({
      type: FOLLOW_CHANGE_END,
    });
    console.log(err);
  }
};

export const setUnfollow = following_id => async (dispatch, getState) => {
  dispatch({
    type: FOLLOW_CHANGE_LOADING,
  });
  const user_id = getState().login.user ? getState().login.user.id : '';
  try {
    await Client4.unfollowUser({user_id, following_id});
    dispatch({
      type: SET_UNFOLLOWING_SUCESS,
      payload: following_id,
    });
    dispatch({
      type: FOLLOW_CHANGE_END,
    });
  } catch (err) {
    dispatch({
      type: FOLLOW_CHANGE_END,
    });
    console.log(err);
  }
};
