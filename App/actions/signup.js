import Client4 from '../api/MattermostClient';

export const IS_SIGN_UP = 'IS_SIGN_UP';
export const CREATE_USER_SUCESS = 'CREATE_USER_SUCESS';
export const CREATE_USER_FAILED = 'CREATE_USER_ERROR';

export const client4CreateUser = ({
  email,
  username,
  password,
  first_name,
  last_name,
}) => async dispatch => {
  try {
    const user = {
      email: email,
      username: username,
      password: password,
      first_name: first_name,
      last_name: last_name,
      allow_marketing: 1,
    };
    const result = await Client4.createUser(user);
    const data = {
      user: result,
    };
    dispatch(createUserSuccess(data));
    return data;
  } catch (ex) {
    createUserFailed(ex);
    return Promise.reject(ex);
  }
};

const isSignUp = signUp => ({
  type: IS_SIGN_UP,
  payload: signUp,
});

export const createUser = (
  username,
  email,
  password,
  phone,
  callingCode,
  firstName,
  lastName,
) => async dispatch => {
  try {
    const {data} = await Client4.createUserOld({
      email,
      username,
      password,
      phone,
      callingCode,
      firstName,
      lastName,
    });
    dispatch(createUserSuccess(data));
    return data;
  } catch (ex) {
    dispatch(createUserFailed(ex || ex.response.data));
    return Promise.reject(ex || ex.response.data);
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
