import {SET_REPOST_ACTIVE_ON_INPUT} from '../actions/repost';

const initialState = null;

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_REPOST_ACTIVE_ON_INPUT:
      return payload;
    default:
      return state;
  }
};
