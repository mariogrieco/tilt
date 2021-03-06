import {NEW_CHANNELS_TAB_PAGINATOR_SUCCESS} from '../actions/tab_channels_actions';

const initialState = {
  page: 0,
  stop: false,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case NEW_CHANNELS_TAB_PAGINATOR_SUCCESS:
      return payload;
    default:
      return state;
  }
};
