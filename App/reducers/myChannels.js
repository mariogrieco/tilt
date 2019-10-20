import {
  GET_MY_CHANNELS_SUCESS,
  // GET_MY_CHANNELS_ERROR
  ADD_TO_CHANNEL_SUCESS,
  REMOVE_FROM_CHANNEL_SUCESS,
  CREATE_CHANNEL_SUCESS,
  // GET_CHANNEL_BY_ID_SUCCESS,
  UPDATE_CHANNEL_HEADER_SUCCESS,
  UPDATE_PURPOSE_SUCCESS,
  UPDATE_DISPLAY_NAME_SUCCESS,
  CHANNEL_UPDATED_SUCCESS,
  GET_MY_CHANNEL_BY_ID_SUCCESS,
  DELETE_CHANNEL_SUCCESS
} from '../actions/channels';
import {
  IS_SIGN_UP
} from '../actions/signup';
import {
  LOGOUT_SUCESS
} from '../actions/login';
import uniqBy from 'lodash/uniqBy';

import mergeWith from 'lodash/mergeWith';
import isEmpty from 'lodash/isEmpty';

function customizer(objValue, srcValue) {
  if (!isEmpty(srcValue)) {
    return srcValue;
  } else {
    return objValue;
  };
};

const initialState = [];

const myChannels = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_SUCESS: {
      return [];
    }
    case DELETE_CHANNEL_SUCCESS: {
      const channelId = action.payload.channelId;
      return [...state].filter(channel => channel.id !== channelId);
    }
    case CHANNEL_UPDATED_SUCCESS: {
      return state.map(channel => {
        if (channel.id === action.payload.id) {
          mergeWith(channel, action.payload, customizer);
          return channel; 
        }
        return channel;
      });
    }
    case UPDATE_CHANNEL_HEADER_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newHeader = action.payload.props.new_header;
      return state.map(channel => {
        if (channel.id === channelID) {
          return {
            ...channel,
            header: newHeader
          }
        };
        return channel
      });
    }
    case UPDATE_DISPLAY_NAME_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newDisplayName = action.payload.props.new_displayname
      return state.map(channel => {
        if (channel.id === channelID) {
          return {
            ...channel,
            display_name: newDisplayName
          }
        };
        return channel
      });
    }
    case UPDATE_PURPOSE_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newPurpose = action.payload.props.new_purpose;
      return state.map(channel => {
        if (channel.id === channelID) {
          return {
            ...channel,
            purpose: newPurpose
          }
        };
        return channel
      });
    }
    case GET_MY_CHANNEL_BY_ID_SUCCESS: {
      let nexState = [...state];
      const { channel } = action.payload;
      nexState.unshift(channel);
      nexState = uniqBy(nexState, 'id');
      return nexState;
    }
    case GET_MY_CHANNELS_SUCESS:
      return action.payload;
    case ADD_TO_CHANNEL_SUCESS: {
      const channels = [...state];
      channels.push(action.payload);
      return channels;
    }
    case CREATE_CHANNEL_SUCESS: {
      const nextState = [...state];
      nextState.push(action.payload);
      return nextState;
    }
    case IS_SIGN_UP: {
      return [];
    }
    case REMOVE_FROM_CHANNEL_SUCESS: {
      const nextState = state.filter(({ id }) => id !== action.payload);
      return nextState;
    }
    default:
      return state;
  }
};

export default myChannels;
