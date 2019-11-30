import Client4 from '../api/MattermostClient';

export const GET_MY_FOLLOWS_SUCCESS = 'GET_MY_FOLLOWS_SUCCESS';
export const GET_MY_FOLLOWS_ERROR = 'GET_MY_FOLLOWS_ERROR';
export const GET_FOLLOWS_FOR_FOCUS_USER_SUCCESS =
  'GET_FOLLOWS_FOR_FOCUS_USER_SUCCESS';
export const GET_FOLLOWS_FOR_FOCUS_USER_ERROR =
  'GET_FOLLOWS_FOR_FOCUS_USER_ERROR';

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
