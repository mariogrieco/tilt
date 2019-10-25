import {cloneDeep, keys} from 'lodash';
import {
  // GET_LAST_VIEW_FOR_CHANNELS_ERROR,
  GET_LAST_VIEW_FOR_CHANNELS_SUCCESS,
} from '../actions/channels';

const initialState = {};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_LAST_VIEW_FOR_CHANNELS_SUCCESS: {
      const nextState = cloneDeep(state);
      keys(payload).forEach(id => {
        nextState[id] = payload[id];
      });
      return nextState;
    }
    default:
      return state;
  }
};
