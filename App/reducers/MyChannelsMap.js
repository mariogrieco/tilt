import {
  GET_MY_CHANNELS_SUCESS,
  ADD_TO_CHANNEL_SUCESS,
  REMOVE_FROM_CHANNEL_SUCESS,
  CREATE_CHANNEL_SUCESS,
  GET_MY_CHANNEL_BY_ID_SUCCESS,
  DELETE_CHANNEL_SUCCESS,
} from '../actions/channels';
import {IS_SIGN_UP} from '../actions/signup';
import {LOGOUT_SUCESS} from '../actions/login';

import Immutable from 'immutable';

const initialState = new Immutable.Map({});

const myChannels = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_CHANNELS_SUCESS: {
      let nextState = state;
      action.payload.forEach(element => {
        nextState = nextState.set(element.id, true);
      });
      return nextState;
    }
    case LOGOUT_SUCESS: {
      return initialState;
    }
    case IS_SIGN_UP: {
      return initialState;
    }
    case ADD_TO_CHANNEL_SUCESS: {
      return state.set(action.payload.id, action.payload.id);
    }
    case CREATE_CHANNEL_SUCESS: {
      let nextState = state;
      nextState = state.set(action.payload.id, action.payload.id);
      return nextState;
    }
    case REMOVE_FROM_CHANNEL_SUCESS: {
      if (state.has(action.payload)) {
        return state.remove(action.payload);
      }
      return state;
    }
    case GET_MY_CHANNEL_BY_ID_SUCCESS: {
      const {channel} = action.payload;
      return state.set(channel.id, channel.id);
    }
    case DELETE_CHANNEL_SUCCESS: {
      const {channelId} = action.payload;
      if (state.has(channelId)) state.delete(channelId);
      return state;
    }
    default:
      return state;
  }
};

export default myChannels;
