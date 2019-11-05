import Client4 from '../api/MattermostClient';

export const GET_BLOCKED_USER_LIST_SUCCESS = 'GET_BLOCKED_USER_LIST_SUCCESS';
export const GET_BLOCKED_USER_LIST_ERROR = 'GET_BLOCKED_USER_LIST_ERROR';

export const getBlockUserListForUserId = user_id => async (dispatch, store) => {
  try {
    const list = await Client4.getBlockUserListForUserId(user_id);
    dispatch(getBlockUserListForUserIdSuccess(list));
    return list;
  } catch (ex) {
    dispatch(getBlockUserListForUserIdError(ex));
    return Promise.reject(ex);
  }
};

function getBlockUserListForUserIdSuccess(list) {
  return {
    type: GET_BLOCKED_USER_LIST_SUCCESS,
    payload: list,
  };
}

function getBlockUserListForUserIdError(err) {
  return {
    type: GET_BLOCKED_USER_LIST_ERROR,
    payload: err,
  };
}
