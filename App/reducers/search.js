import {
  // SEARCH_CHANNELS_ERROR,
  SEARCH_CHANNELS_SUCCESS,
} from '../actions/search';

import fix_name_if_need from '../utils/fix_name_if_need';

const initialState = [];

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SEARCH_CHANNELS_SUCCESS: {
      return payload.map(channel => fix_name_if_need(channel));
    }
    default: {
      return state;
    }
  }
};
