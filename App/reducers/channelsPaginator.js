import {
  SET_CHANNEL_PAGINATOR
} from '../actions/channels';

const initialState = {
  current_page: 0,
  stop: false
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CHANNEL_PAGINATOR: {
      return { ...payload };
    }
    default: {
      return state;
    }
  }
};
