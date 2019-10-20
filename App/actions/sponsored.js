import Client4 from '../api/MattermostClient';

export const SET_NEW_SPONSORED_STRING = 'SET_NEW_SPONSORED_STRING';
export const GET_SPONSORED_ERROR = 'GET_SPONSORED_ERROR';
export const GET_SPONSORED_SUCCESS = 'GET_SPONSORED_SUCCESS';

export const getLastSponsored = () => async (dispatch) => {
  try {
    const str = await Client4.getSponsored();
    if (!!str) {
      if (str.trim().length > 0) {
        dispatch({
          type: GET_SPONSORED_SUCCESS,
          payload: str
        });
        setNewSponsored(str);
        return str;
      }
    }
    throw new Error(str);
  } catch (ex) {
    dispatch({
      type: GET_SPONSORED_ERROR,
      payload: ex
    });
    return Promise.reject(ex);
  }
};

export const setNewSponsored = str => ({
  type: SET_NEW_SPONSORED_STRING,
  payload: str
});
