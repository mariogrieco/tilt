import {
  CODE_REQUEST_ERROR,
  CODE_REQUEST_SUCCESS
} from '../actions/codeVerification';

const initialState = {
  code: null,
  phoneNumber: null,
  err: null,
  hasData: false
};

const codeVerification = (state = initialState, action) => {
  switch (action.type) {
    case CODE_REQUEST_SUCCESS:
      return { ...state, ...action.payload };
    case CODE_REQUEST_ERROR:
      return { ...state, ...action.err };
    default:
      return state;
  }
};

export default codeVerification;
