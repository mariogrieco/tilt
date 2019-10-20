import {
  SET_NEW_SPONSORED_STRING,
  // GET_SPONSORED_ERROR,
  // GET_SPONSORED_SUCCESS
} from '../actions/sponsored';

const initialState = 'jk5osmydatgt5kaahkeheprk6e,';

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
