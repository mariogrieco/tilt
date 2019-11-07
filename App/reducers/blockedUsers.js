import {
  GET_BLOCKED_USER_LIST_SUCCESS,
  BLOCK_USER_ID_SUCCESS,
  UNBLOCK_USER_ID_SUCCESS,
} from '../actions/blockedUsers';

import cloneDeep from 'lodash/cloneDeep';

const initialState = {};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case BLOCK_USER_ID_SUCCESS: {
      let nextState = cloneDeep(state);
      nextState[payload.blocked_id] = payload;
      return nextState;
    }
    case UNBLOCK_USER_ID_SUCCESS: {
      let nextState = cloneDeep(state);
      if (nextState[payload.blocked_id]) {
        nextState[payload.blocked_id] = undefined;
        delete nextState[payload.blocked_id];
        return nextState;
      }
      return nextState;
    }
    case GET_BLOCKED_USER_LIST_SUCCESS: {
      let nextState = cloneDeep(state);
      payload.forEach(item => {
        nextState[item.blocked_id] = item;
      });
      return nextState;
    }
    default: {
      return state;
    }
  }
};
