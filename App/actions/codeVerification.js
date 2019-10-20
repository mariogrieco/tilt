import axios from 'axios';

import {baseServicesUrl} from '../api/MattermostClient';

export const CODE_REQUEST_SUCCESS = 'CODE_REQUEST_SUCCESS';
export const CODE_REQUEST_ERROR = 'CODE_REQUEST_ERROR';

export const USER_VERIFICATION_SUCCESS = 'USER_VERIFICATION_SUCCESS';
export const USER_VERIFICATION_ERROR = 'USER_VERIFICATION_ERROR';

export const getVerificationCode = phoneNumber => async dispatch => {
  try {
    const result = await axios.post(`${baseServicesUrl}/sms`, {phoneNumber});
    dispatch({
      type: CODE_REQUEST_SUCCESS,
      payload: {
        code: result.data.code,
        phoneNumber,
        hasData: true,
      },
    });
  } catch (e) {
    dispatch({
      type: CODE_REQUEST_ERROR,
      err: e.response.data.error,
      phoneNumber,
    });
    return Promise.reject(e.response.data.error);
  }
};
export const verificateUser = ({
  user_id,
  phone,
  device_id,
  verified,
  token,
}) => async dispatch => {
  try {
    const {data} = await axios.post(`${baseServicesUrl}/user-verification`, {
      user_id,
      phone,
      device_id,
      verified,
      token,
    });
    dispatch({
      type: USER_VERIFICATION_SUCCESS,
      payload: data,
    });
    return data;
  } catch (err) {
    dispatch({
      type: USER_VERIFICATION_ERROR,
      payload: err,
    });
    return err;
  }
};
