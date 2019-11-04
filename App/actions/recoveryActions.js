import axios from 'axios';

import {baseServicesUrl} from '../api/MattermostClient';

export const RECOVERY_REQUEST_SUCCESS = 'RECOVERY_REQUEST_SUCCESS';
export const RECOVERY_REQUEST_ERROR = 'RECOVERY_REQUEST_ERROR';

export const UPDATE_PASSWORD_SUCCESS = 'UPDATE_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD_ERROR = 'UPDATE_PASSWORD_ERROR';

export const getVerificationCode = ({username, email}) => async dispatch => {
  try {
    const r = await axios.post(`${baseServicesUrl}/recovery/using-email`, {
      username,
      email,
    });
    dispatch({
      type: RECOVERY_REQUEST_SUCCESS,
      payload: {
        token: r.data.token,
        email,
      },
    });
    return r.data;
  } catch (ex) {
    dispatch({
      type: RECOVERY_REQUEST_ERROR,
      payload: ex.response.data,
    });
    return Promise.reject(ex.response.data);
  }
};

export const updatePassword = ({token, newPassword}) => async dispatch => {
  try {
    const {data} = await axios.put(`${baseServicesUrl}/recovery`, {
      token,
      newPassword,
    });
    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data,
    });
    return data;
  } catch ({response}) {
    dispatch({
      type: UPDATE_PASSWORD_ERROR,
      payload: response.data,
    });
    return Promise.reject(response.data.message);
  }
};
