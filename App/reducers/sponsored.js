import {
  SET_NEW_SPONSORED_STRING,
  // GET_SPONSORED_ERROR,
  // GET_SPONSORED_SUCCESS
} from '../actions/sponsored';

const initialState = 'bcbwo17xxpnx8pj6ecfk1pbgco,';

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_NEW_SPONSORED_STRING: {
      return payload;
    }
    default: {
      return state;
    }
  }
};
