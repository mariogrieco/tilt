import {GET_CHANNEL_PREVIEW_SUCCESS} from '../actions/channelPreview';

import cloneDeep from 'lodash/cloneDeep';

const initialState = {};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_CHANNEL_PREVIEW_SUCCESS: {
      let nextState = cloneDeep(state);
      nextState[payload.channel_id] = payload.posts;
      return nextState;
    }
    default: {
      return state;
    }
  }
};
