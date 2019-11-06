import Client4 from '../api/MattermostClient';

export const GET_BLOCKED_USER_LIST_SUCCESS = 'GET_BLOCKED_USER_LIST_SUCCESS';
export const GET_BLOCKED_USER_LIST_ERROR = 'GET_BLOCKED_USER_LIST_ERROR';

export const BLOCK_USER_ID_SUCCESS = 'BLOCK_USER_ID_SUCCESS';
export const BLOCK_USER_ID_ERROR = 'BLOCK_USER_ID_ERROR';
export const UNBLOCK_USER_ID_SUCCESS = 'UNBLOCK_USER_ID_SUCCESS';

export const getBlockUserListForUserId = user_id => async dispatch => {
  try {
    const list = await Client4.getBlokedUsers(user_id);
    dispatch(getBlockUserListForUserIdSuccess(list));
    console.log(list);
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

export const addOrRemoveOne = blocking_user_id => async (
  dispatch,
  getState,
) => {
  try {
    const meId = getState().login.user.id;
    const result = await Client4.addOrRemoveOneBlockedUser(
      meId,
      blocking_user_id,
    );
    if (!result.delete_at) {
      dispatch(blockUserIdSuccess(result));
    } else {
      dispatch(unblockUserIdSuccess(result));
    }
    return result;
  } catch (ex) {
    dispatch(blockUserIdError(ex));
    return Promise.reject(ex);
  }
};

function unblockUserIdSuccess(data) {
  return {
    type: UNBLOCK_USER_ID_SUCCESS,
    payload: data,
  };
}

function blockUserIdSuccess(data) {
  return {
    type: BLOCK_USER_ID_SUCCESS,
    payload: data,
  };
}

function blockUserIdError(err) {
  return {
    type: BLOCK_USER_ID_ERROR,
    payload: err,
  };
}
