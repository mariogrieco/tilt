import Client4 from '../api/MattermostClient';

export const GET_MY_FOLLOWS_SUCCESS = 'GET_MY_FOLLOWS_SUCCESS';
export const GET_MY_FOLLOWS_ERROR = 'GET_MY_FOLLOWS_ERROR';

const getFollows = user_id => async (dispatch, getState) => {
  try {
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

export default getFollows;
