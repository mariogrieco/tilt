import {
  SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID,
  SET_ACTIVE_FOCUS_CHANNEL_ID,
  SET_ACTIVE_THREAD_DATA,
  SET_ACTIVE_EDIT_POST_ID,
} from '../actions/AppNavigation';
import {LOGOUT_SUCESS} from '../actions/login';

import cloneDeep from 'lodash/cloneDeep';

const initialState = {
  active_channel_id: null,
  active_channel_details_id: null,
  active_thread_data: null,
  active_edit_post_id: null,
  prev_active_channel_id: null,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case LOGOUT_SUCESS: {
      return {
        active_channel_id: null,
        active_channel_details_id: null,
        active_thread_data: null,
        active_edit_post_id: null,
      };
    }
    case SET_ACTIVE_EDIT_POST_ID: {
      const nextState = cloneDeep(state);
      nextState.active_edit_post_id = payload;
      return nextState;
    }
    case SET_ACTIVE_THREAD_DATA: {
      const nextState = cloneDeep(state);
      nextState.active_thread_data = payload;
      return nextState;
    }
    case SET_ACTIVE_FOCUS_CHANNEL_ID: {
      const nextState = cloneDeep(state);
      nextState.active_channel_id = payload;
      nextState.prev_active_channel_id = state.active_channel_id;
      return nextState;
    }
    case SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID: {
      const nextState = cloneDeep(state);
      nextState.active_channel_details_id = payload;
      return nextState;
    }
    default:
      return state;
  }
};
