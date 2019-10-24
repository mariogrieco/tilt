import {SET_NEW_ADMIN_CREATORS} from '../actions/adminCreators';

const initialState = 'jk5osmydatgt5kaahkeheprk6e,';

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_NEW_ADMIN_CREATORS: {
      return payload;
    }
    default: {
      return state;
    }
  }
};
