import Client4 from '../api/MattermostClient';

export const IS_SIGN_UP = 'IS_SIGN_UP';
export const CREATE_USER_SUCESS = 'CREATE_USER_SUCESS';
export const CREATE_USER_FAILED = 'CREATE_USER_ERROR';

const isSignUp = signUp => ({
  type: IS_SIGN_UP,
  payload: signUp,
});

export const createUser = (
  username,
  email,
  password,
  phone,
  firstName,
  lastName,
) => async dispatch => {
  try {
    const {data} = await Client4.createUser({
      email,
      username,
      password,
      phone,
      firstName,
      lastName,
    });
    dispatch(createUserSuccess(data));
    return data;
  } catch (ex) {
    dispatch(createUserFailed(ex.response.data));
    return Promise.reject(ex.response.data.error);
  }
};

const createUserSuccess = data => ({
  type: CREATE_USER_SUCESS,
  payload: data,
});

const createUserFailed = message => ({
  type: CREATE_USER_FAILED,
  payload: message,
});

export default isSignUp;
