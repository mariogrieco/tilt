import {
  RECOVERY_REQUEST_SUCCESS,
} from '../actions/recoveryActions';

const initialState = {};

const recovery = (state = initialState, action) => {
  switch (action.type) {
    case RECOVERY_REQUEST_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default recovery;
