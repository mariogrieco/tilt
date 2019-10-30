import Client4 from '../api/MattermostClient';

export const GET_POST_COUNT_SUCCESS = 'GET_POST_COUNT_SUCCESS'; 
export const GET_POST_COUNT_ERROR = 'GET_POST_COUNT_ERROR';

export const getPostCount = userId => async (dispatch, getState) => {
  try {
    const team_id = getState().teams.default_team_id;
    const data = await Client4.getPostCountForUser(team_id, userId);
    dispatch(
      getPostCountSucess({
        userId,
        data,
      }),
    );
    return data;
  } catch (ex) {
    dispatch(getPostCountError(ex));
    return Promise.reject(ex.message);
  }
};

export const getPostCountSucess = data => ({
  type: GET_POST_COUNT_SUCCESS,
  payload: data,
});

export const getPostCountError = err => ({
  type: GET_POST_COUNT_ERROR,
  payload: err,
});
