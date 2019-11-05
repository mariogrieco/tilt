import {GET_BLOCKED_USER_LIST_SUCCESS} from '../actions/blockedUsers';

const initialState = [
  // user_id,
  // user_id,
];

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_BLOCKED_USER_LIST_SUCCESS:
      return payload;
    default:
      return state;
  }
};
