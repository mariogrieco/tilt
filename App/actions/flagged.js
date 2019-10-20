import Client4 from '../api/MattermostClient';

export const GET_FLAGGED_SUCESS = 'GET_FLAGGED_SUCESS';
export const GET_FLAGGED_ERROR = 'GET_FLAGGED_ERROR';

export const SET_FLAGGED_SUCESS = 'SET_FLAGGED_SUCESS';
export const SET_FLAGGED_ERROR = 'SET_FLAGGED_ERROR';

export const getFlagged = () => async (dispatch, getState) => {
  try {
    const userId = getState().login.user.id;
    const flaggedPosts = await Client4.getFlaggedPosts(userId);
    dispatch(getFlaggedSucess(flaggedPosts));
    return flaggedPosts;
  } catch (ex) {
    dispatch(getFlaggedError(ex));
    return Promise.reject(ex.message);
;
  }
};

export const getFlaggedSucess = flaggedPosts => ({
  type: GET_FLAGGED_SUCESS,
  payload: flaggedPosts
});

export const getFlaggedError = err => ({
  type: GET_FLAGGED_ERROR,
  payload: err
});

function getSetFlagSchema (user_id, post_id) {
  return [{
    category: 'flagged_post',
    name: post_id,
    user_id,
    value: 'true'
  }];
};

export const setFlagged = (userId, postId) => async (dispatch) => {
  try {
    const preference = getSetFlagSchema(userId, postId);
    const result = await Client4.savePreferences(userId, preference);
    dispatch(getFlagged());
    return result;
  } catch (ex) {
    dispatch(setFlaggedError(ex));
    return Promise.reject(ex.message);
  };
};

export const setFlaggedSucess = flaggedPosts => ({
  type: SET_FLAGGED_SUCESS,
  payload: flaggedPosts
});

export const setFlaggedError = err => ({
  type: SET_FLAGGED_ERROR,
  payload: err
});


export const removeFlagged = (userId, postId) => async (dispatch) => {
  try {
    const preference = getSetFlagSchema(userId, postId);
    await Client4.deletePreferences(userId, preference);
    dispatch(getFlagged());
    return preference;
  } catch (ex) {
    dispatch(setFlaggedError(ex));
    return Promise.reject(ex.message);
  };
};

// export const setFlaggedSucess = flaggedPosts => ({
//   type: SET_FLAGGED_SUCESS,
//   payload: flaggedPosts
// });

// export const setFlaggedError = err => ({
//   type: SET_FLAGGED_ERROR,
//   payload: err
// });