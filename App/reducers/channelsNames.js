import {
  GET_CHANNELS_SUCESS,
  GET_CHANNEL_BY_ID_SUCCESS,
  CREATE_CHANNEL_SUCESS,
  UPDATE_CHANNEL_HEADER_SUCCESS,
  UPDATE_PURPOSE_SUCCESS,
  UPDATE_DISPLAY_NAME_SUCCESS,
  CHANNEL_UPDATED_SUCCESS,
  GET_CHANNEL_BY_NAME_SUCCESS,
  DELETE_CHANNEL_SUCCESS,
  GET_MY_CHANNEL_BY_ID_SUCCESS,
  GET_MY_CHANNELS_SUCESS,
} from '../actions/channels';

import parser from '../../App/utils/parse_display_name';

import mergeWith from 'lodash/mergeWith';
import keys from 'lodash/keys';
// import uniqBy from 'lodash/uniqBy';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

function customizer(objValue, srcValue) {
  if (!isEmpty(srcValue)) {
    return srcValue;
  } else {
    return objValue;
  }
}

const initialState = {
  id: {
    // formatedName: '',
    // ...channel
  },
};

function setFormatedNames(channels) {
  keys(channels).forEach(key => {
    if (channels[key]) {
      channels[key].format_name = parser(channels[key].display_name || '');
    }
  });
  return channels;
}

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_CHANNEL_BY_NAME_SUCCESS:
    case CREATE_CHANNEL_SUCESS:
    case GET_CHANNEL_BY_ID_SUCCESS: {
      const nextState = cloneDeep(state);
      nextState[payload.id] = payload;
      return setFormatedNames(nextState);
    }
    case GET_MY_CHANNELS_SUCESS:
    case GET_CHANNELS_SUCESS: {
      const nextState = cloneDeep(state);
      payload.forEach(channel => {
        nextState[channel.id] = channel;
      });
      return setFormatedNames(nextState);
    }
    case UPDATE_CHANNEL_HEADER_SUCCESS: {
      const nextState = cloneDeep(state);
      const channelID = payload.channel_id;
      const newHeader = payload.props.new_header;
      if (nextState[channelID]) {
        nextState[channelID].header = newHeader;
      }
      return setFormatedNames(nextState);
    }
    case UPDATE_PURPOSE_SUCCESS: {
      const nextState = cloneDeep(state);
      const channelID = payload.channel_id;
      const newPurpose = payload.props.new_purpose;
      if (nextState[channelID]) {
        nextState[channelID].purpose = newPurpose;
      }
      return setFormatedNames(nextState);
    }
    case UPDATE_DISPLAY_NAME_SUCCESS: {
      const nextState = cloneDeep(state);
      const channelID = payload.channel_id;
      const newDisplayName = payload.props.new_displayname;
      if (nextState[channelID]) {
        nextState[channelID].display_name = newDisplayName;
      }
      return setFormatedNames(nextState);
    }
    case CHANNEL_UPDATED_SUCCESS: {
      const nextState = cloneDeep(state);
      if (nextState[payload.id]) {
        mergeWith(nextState[payload.id], payload, customizer);
      }
      return setFormatedNames(nextState);
    }
    case GET_MY_CHANNEL_BY_ID_SUCCESS: {
      const nextState = cloneDeep(state);
      const {channel} = payload;
      nextState[channel.id] = channel;
      return setFormatedNames(nextState);
    }
    case DELETE_CHANNEL_SUCCESS: {
      const nextState = cloneDeep(state);
      delete nextState[payload.channelId];
      return setFormatedNames(nextState);
    }
    default: {
      return state;
    }
  }
};
