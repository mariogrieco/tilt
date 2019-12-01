import {
  GET_CHANNELS_SUCESS,
  GET_CHANNEL_BY_ID_SUCCESS,
  UPDATE_CHANNEL_HEADER_SUCCESS,
  UPDATE_PURPOSE_SUCCESS,
  UPDATE_DISPLAY_NAME_SUCCESS,
  CHANNEL_UPDATED_SUCCESS,
  GET_CHANNEL_BY_NAME_SUCCESS,
  ADD_TO_CHANNEL_SUCESS,
  DELETE_CHANNEL_SUCCESS,
  GET_MY_CHANNELS_SUCESS,
  CREATE_CHANNEL_SUCESS,
  GET_MY_CHANNEL_BY_ID_SUCCESS,
} from '../actions/channels';
import {GET_PAGE_SUCCESS} from '../actions/HashtagChannelsPaginator';
import {IS_SIGN_UP} from '../actions/signup';
import {LOGOUT_SUCESS} from '../actions/login';
import {SEARCH_CHANNELS_SUCCESS} from '../actions/search';

import Immutable from 'immutable';

const initialState = new Immutable.OrderedMap({});

import fix_name_if_need from '../utils/fix_name_if_need';

const channels = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_CHANNELS_SUCESS: {
      let nextState = state;
      action.payload.forEach(element => {
        nextState = nextState.set(element.id, fix_name_if_need(element));
      });
      return nextState;
    }
    case CREATE_CHANNEL_SUCESS: {
      let nextState = state;
      nextState = state.set(
        action.payload.id,
        fix_name_if_need(action.payload),
      );
      return nextState;
    }
    case GET_MY_CHANNEL_BY_ID_SUCCESS: {
      const {channel} = action.payload;
      return state.set(channel.id, fix_name_if_need(channel));
    }
    case GET_CHANNELS_SUCESS: {
      let nextState = state;
      action.payload.forEach(element => {
        nextState = nextState.set(element.id, fix_name_if_need(element));
      });
      return nextState;
    }
    case GET_PAGE_SUCCESS: {
      let nextState = state;
      action.payload.channels.forEach(element => {
        nextState = nextState.set(element.id, fix_name_if_need(element));
      });
      return nextState;
    }
    case IS_SIGN_UP: {
      return initialState;
    }
    case GET_CHANNEL_BY_ID_SUCCESS: {
      const channel = action.payload;
      return state.set(channel.id, fix_name_if_need(channel));
    }
    case GET_CHANNEL_BY_NAME_SUCCESS: {
      let nextState = state;
      const channel = action.payload;
      nextState = nextState.set(channel.id, fix_name_if_need(channel));
      return nextState;
    }
    case UPDATE_CHANNEL_HEADER_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newHeader = action.payload.props.new_header;
      if (state.has(channelID)) {
        const currentItem = state.get(channelID);
        currentItem.header = newHeader;
        return state.set(channelID, currentItem);
      }
      return state;
    }
    case UPDATE_PURPOSE_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newPurpose = action.payload.props.new_purpose;
      if (state.has(channelID)) {
        const currentItem = state.get(channelID);
        currentItem.purpose = newPurpose;
        return state.set(channelID, currentItem);
      }
      return state;
    }
    case UPDATE_DISPLAY_NAME_SUCCESS: {
      const channelID = action.payload.channel_id;
      const newDisplayName = action.payload.props.new_displayname;
      if (state.has(channelID)) {
        const currentItem = state.get(channelID);
        currentItem.display_name = newDisplayName;
        return state.set(channelID, currentItem);
      }
      return state;
    }
    case CHANNEL_UPDATED_SUCCESS: {
      const channel = action.payload;
      if (state.has(channel.id)) {
        const current = Immutable.mergeDeep(state.get(channel.id), channel);
        return state.set(channel.id, fix_name_if_need(current));
      }
      return state;
    }
    case DELETE_CHANNEL_SUCCESS: {
      const {channelId} = action.payload;
      if (state.has(channelId)) state.delete(channelId);
      return state;
    }
    case LOGOUT_SUCESS: {
      return initialState;
    }
    case SEARCH_CHANNELS_SUCCESS: {
      if (!action.payload || action.payload.length === 0) return state;
      let nextState = state;
      action.payload.forEach(channel => {
        nextState = nextState.set(channel.id, fix_name_if_need(channel));
      });
      return nextState;
    }
    // case ADD_TO_CHANNEL_SUCESS: {
      // if (state.has(action.payload.id)) {
      //   return state.delete(action.payload.id);
      // }
      // return state;
    // }
    default:
      return state;
  }
};

export default channels;
