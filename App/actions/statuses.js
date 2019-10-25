import Client4 from '../api/MattermostClient';

export const GET_STATUSES_ERROR = 'GET_STATUSES_ERROR';
export const GET_STATUSES_SUCCESS = 'GET_STATUSES_SUCCESS';

export const STATUSES_CHANGE = 'STATUSES_CHANGE';

export const getStatuses = usersIds => async (dispatch, getState) => {
  try {
    usersIds = usersIds ? usersIds : getState().users.map(({id}) => id);
    const statuses = await Client4.getStatusesByIds(usersIds);
    dispatch(getStatusesSucess(statuses));
    return statuses;
  } catch (ex) {
    dispatch(getStatusesError(ex));
    return Promise.reject(ex.message);
  }
};

export const getStatusesSucess = statuses => ({
  type: GET_STATUSES_SUCCESS,
  payload: statuses,
});

export const getStatusesError = err => ({
  type: GET_STATUSES_ERROR,
  payload: err,
});

export const statusChange = data => ({
  type: STATUSES_CHANGE,
  payload: data,
});
