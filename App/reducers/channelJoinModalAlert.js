import {
  SET_ACTIVE_MODAL_ID,
  CLOSE_ACTIVE_MODAL_ID
} from '../actions/channelJoinModalAlert'

const initialState = {
  channelId: null
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ACTIVE_MODAL_ID: {
      return {
        channelId: payload
      };
    }
    case CLOSE_ACTIVE_MODAL_ID: {
      return {
        channelId: null
      };
    }
    default:
      return state
  }
};
