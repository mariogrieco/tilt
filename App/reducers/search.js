import {
  // SEARCH_CHANNELS_ERROR,
  SEARCH_CHANNELS_SUCCESS
} from '../actions/search'

const initialState = [];

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SEARCH_CHANNELS_SUCCESS: {
      return payload;
    }
    default: {
      return state;
    }
  }
};
