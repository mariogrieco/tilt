import Client4 from '../api/MattermostClient';

export const GET_MY_PREFERENCES_SUCCESS = 'GET_MY_PREFERENCES_SUCCESS';
export const GET_MY_PREFERENCES_ERROR = 'GET_MY_PREFERENCES_ERROR';

export const getMyPreferences = () => async (dispatch) => {
  try {
    const result = await Client4.getMyPreferences();
    dispatch(getMyPreferencesSucess(result));
  } catch (ex) {
    dispatch(getMyPreferencesError(ex));
    return Promise.reject(ex.message);
;
  }
};

export const getMyPreferencesSucess = users => ({
  type: GET_MY_PREFERENCES_SUCCESS,
  payload: users
});

export const getMyPreferencesError = err => ({
  type: GET_MY_PREFERENCES_ERROR,
  payload: err
});
