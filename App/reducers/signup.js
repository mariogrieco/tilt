import {
  IS_SIGN_UP,
  CREATE_USER_SUCESS
} from '../actions/signup';

const initialState = {
  isSignUp: false,
  // account: null
};

// const mapPayloadToState = () => {} // required

const signUp = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER_SUCESS: {
      return {
        ...state,
        isSignUp: action.payload
      };
    }
    case IS_SIGN_UP:
      return {
        ...state,
        isSignUp: action.payload
      };
    default:
      return state;
  }
};

export default signUp;
