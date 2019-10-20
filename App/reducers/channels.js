import {
  GET_CHANNELS_SUCESS,
  GET_CHANNEL_BY_ID_SUCCESS,
  CREATE_CHANNEL_SUCESS,
  UPDATE_CHANNEL_HEADER_SUCCESS,
  UPDATE_PURPOSE_SUCCESS,
  UPDATE_DISPLAY_NAME_SUCCESS,
  CHANNEL_UPDATED_SUCCESS,
  GET_CHANNEL_BY_NAME_SUCCESS,
  ADD_TO_CHANNEL_SUCESS,
  DELETE_CHANNEL_SUCCESS
} from '../actions/channels';
import {
  IS_SIGN_UP
} from '../actions/signup';
import {
  LOGOUT_SUCESS
} from '../actions/login';
import {
  SEARCH_CHANNELS_SUCCESS
} from '../actions/search';

import cloneDeep from 'lodash/cloneDeep';
import mergeWith from 'lodash/mergeWith';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy'; 
import initialState from '../config/initialState/channels';
import concat from 'lodash/concat';

function customizer(objValue, srcValue) {
  if (!isEmpty(srcValue)) {
    return srcValue;
  } else {
    return objValue;
  };
};

const channels = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_CHANNEL_SUCCESS: {
      const channelId = action.payload.channelId;
      return [...state].filter(channel => channel.id !== channelId);
    }
    case LOGOUT_SUCESS: {
      return []
    }
    case SEARCH_CHANNELS_SUCCESS: {
      if (!action.payload || action.payload.length === 0) return state;
      return uniqBy(concat(state, action.payload), 'id');
    }
    case ADD_TO_CHANNEL_SUCESS: {
      return state.filter(channel => {
        if (channel.id === action.payload.id) {
          return false; 
        }
        return true;
      });
    }
    case CHANNEL_UPDATED_SUCCESS: {
      return state.map(channel => {
        const nextChannel = cloneDeep(channel);
        if (channel.id === action.payload.id) {
          mergeWith(nextChannel, action.payload, customizer);
          return nextChannel; 
        }
        return nextChannel;
      });
    }
    case UPDATE_DISPLAY_NAME_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newDisplayName = action.payload.props.new_displayname;
      return state.map(channel => {
        if (channel.id === channelID) {
          return {
            ...cloneDeep(channel),
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
            ...cloneDeep(channel),
            purpose: newPurpose
          }
        };
        return channel
      });
    }
    case UPDATE_CHANNEL_HEADER_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newHeader = action.payload.props.new_header;
      return state.map(channel => {
        if (channel.id === channelID) {
          return {
            ...cloneDeep(channel),
            header: newHeader
          }
        };
        return channel
      });
    }
    case IS_SIGN_UP: {
      return [];
    }
    case GET_CHANNEL_BY_NAME_SUCCESS: {
      let nextState = cloneDeep(state);
      nextState.push(action.payload);  
      nextState = uniqBy(nextState, 'id');
      return nextState;
    }
    case GET_CHANNEL_BY_ID_SUCCESS: {
      let nextState = cloneDeep(state);
      nextState.push(action.payload.channel);
      nextState = uniqBy(nextState, 'id');
      return nextState;
    }
    // case CREATE_CHANNEL_SUCESS: {
    //   const nextState = [...state];
    //   nextState.push(action.payload);
    //   return nextState;
    // }
    case GET_CHANNELS_SUCESS:
      return uniqBy(concat(cloneDeep(state), action.payload), 'id');
    default: {
      return state;
    }
  }
};

export default channels;
