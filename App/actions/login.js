import Client4 from '../api/MattermostClient';
import {Platform} from 'react-native';
import firebase from 'react-native-firebase';

export const IS_LOGIN = 'IS_LOGIN';
export const USER_LOGIN = 'USER_LOGIN';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_USER_FAILED = 'LOGIN_USER_FAILED';

export const CREATE_USER_ACCESS_TOKEN_SUCCESSS =
  'CREATE_USER_ACCESS_TOKEN_SUCCESSS';
export const CREATE_USER_ACCESS_TOKEN_FAILED =
  'CREATE_USER_ACCESS_TOKEN_FAILED';

export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export const LOGOUT_SUCESS = 'LOGOUT_SUCESS';

export const RESET_PASSWORD__FAILED = 'RESET_PASSWORD__FAILED';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';

import {init} from '../api/Sockets';

export const isLogin = login => ({
  type: IS_LOGIN,
  payload: login,
});

export const userLogin = user => ({
  type: USER_LOGIN,
  payload: user,
});

export const createUserAccessToken = (
  userId,
  description,
) => async dispatch => {
  try {
    const token = await Client4.createUserAccessToken(userId, description);
    dispatch(createUserAccessTokenSucess(token));
    return token;
  } catch (ex) {
    dispatch(createUserAccessTokenFailed(ex));
    return Promise.reject(ex.message);
  }
};

const createUserAccessTokenFailed = err => ({
  type: CREATE_USER_ACCESS_TOKEN_FAILED,
  payload: err,
});

const createUserAccessTokenSucess = token => ({
  type: CREATE_USER_ACCESS_TOKEN_SUCCESSS,
  payload: token,
});

export const logout = () => async dispatch => {
  try {
    const r = await Client4.logout();
    dispatch(logoutSuccess(r));
    return r;
  } catch (ex) {
    dispatch(logoutFailed(ex));
    return Promise.reject(ex.message);
  }
};

export const logoutSuccess = message => ({
  type: LOGOUT_SUCESS,
  payload: message,
});

const logoutFailed = err => ({
  type: LOGOUT_FAILED,
  payload: err,
});

export const login = (password, email) => async dispatch => {
  // try {
  //   let fcmToken = await firebase.iid().getToken();
  //   if (fcmToken) {
  //     // user has a device token
  //     // await firebase.messaging().deleteToken();
  //     await firebase.iid().deleteToken();
  //     fcmToken = await firebase.iid().getToken();
  //   } else {
  //     // user doesn't have a device token yet
  //     fcmToken = await firebase.iid().getToken();
  //   }

  //   const device_ref = Platform.select({
  //     android: `android_rn:${fcmToken}`,
  //     ios: `apple_rn:${fcmToken}`,
  //   });

  //   const response = await Client4.login(email, password, '', device_ref);
  //   dispatch(loginSuccess(response));
  //   init();
  //   return response;
  // } catch (ex) {
  //   dispatch(loginFailed(ex));
  //   return Promise.reject(ex.message);
  // }
  try {
    const response = await Client4.login(email, password);
    dispatch(loginSuccess(response));
    init();
    return response;
  } catch (ex) {
    dispatch(loginFailed(ex));
    return Promise.reject(ex.message);
  } finally {
    // alert('done!');
  }
};

export const loginSuccess = user => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailed = err => ({
  type: LOGIN_USER_FAILED,
  payload: err,
});

export const resetPassword = email => async dispatch => {
  try {
    const response = await Client4.sendPasswordResetEmail(email);
    dispatch(resetPasswordSuccess(response));
    return response;
  } catch (ex) {
    dispatch(resetPasswordFailed(ex));
    return Promise.reject(ex.message);
  }
};

const resetPasswordSuccess = user => ({
  type: RESET_PASSWORD_SUCCESS,
  payload: user,
});

const resetPasswordFailed = err => ({
  type: RESET_PASSWORD__FAILED,
  payload: err,
});
