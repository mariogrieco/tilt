import Client4 from '../api/MattermostClient';

export const SET_NEW_ADMIN_CREATORS = 'SET_NEW_ADMIN_CREATORS';
export const GET_NEW_ADMIN_CREATOR_ERROR = 'GET_NEW_ADMIN_CREATOR_ERROR';
export const GET_ADMIN_CREATOR_SUCCESS = 'GET_ADMIN_CREATOR_SUCCESS';

export const getAdminCreator = () => async dispatch => {
  try {
    const str = await Client4.getAdminCreators();
    if (str) {
      if (str.trim().length > 0) {
        if (!str.match('error')) {
          dispatch({
            type: GET_ADMIN_CREATOR_SUCCESS,
            payload: str,
          });
          setNewAdminCreators(str);
        }
        return str;
      }
    }
    throw new Error(str);
  } catch (ex) {
    dispatch({
      type: GET_NEW_ADMIN_CREATOR_ERROR,
      payload: ex,
    });
    return Promise.reject(ex);
  }
};

export const setNewAdminCreators = str => ({
  type: SET_NEW_ADMIN_CREATORS,
  payload: str,
});
