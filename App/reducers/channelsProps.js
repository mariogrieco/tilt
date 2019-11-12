import {GET_MUTE_UNMUTE_PREFERENCES_SUCCESS} from '../actions/channels';

const initialState = {};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_MUTE_UNMUTE_PREFERENCES_SUCCESS:
      return {...state, ...payload};
    default:
      return state;
  }
};
