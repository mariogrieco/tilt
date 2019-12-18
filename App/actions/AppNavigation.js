import NavigationService from '../config//NavigationService';
import {selectedSymbol} from './symbols';
import parser from '../utils/parse_display_name';

export const SET_ACTIVE_FOCUS_CHANNEL_ID = 'SET_ACTIVE_FOCUS_CHANNEL_ID';
export const SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID =
  'SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID';

export const SET_ACTIVE_THREAD_DATA = 'SET_ACTIVE_THREAD_DATA';

export const SET_ACTIVE_EDIT_POST_ID = 'SET_ACTIVE_EDIT_POST_ID';

export const setActiveFocusChannel = id => ({
  payload: id,
  type: SET_ACTIVE_FOCUS_CHANNEL_ID,
});

export const setActiveDetailsFocusChannel = id => ({
  payload: id,
  type: SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID,
});

export const setActiveThreadData = data => ({
  payload: data,
  type: SET_ACTIVE_THREAD_DATA,
});

export const setActiveEditPostId = id => ({
  payload: id,
  type: SET_ACTIVE_EDIT_POST_ID,
});

const getChannelData = (getState, channel_id) => {
  const channel = getState().mapChannels.get(channel_id);
  const onChannel = getState().myChannelsMap.has(channel_id);
  return {
    channel,
    onChannel,
  };
};

export const navigateToChannel = channel_id => (dispatch, getState) => {
  const {channel, onChannel} = getChannelData(getState, channel_id);
  if (!channel) {
    return null;
  }
  if (channel.content_type === 'S') {
    dispatch(navigateToStockRoom(channel_id));
  }
  if (channel.content_type === 'C') {
    dispatch(navigateToCryptoRoom(channel_id));
  }
  // if (channel.content_type === 'N' && channel.type === 'D') {};
  if (channel.content_type === 'N' && channel.type === 'O') {
    dispatch(navigateToChannelRoom(channel_id));
  }
};

export const navigateToStockRoom = channel_id => (dispatch, getState) => {
  const {channel, onChannel} = getChannelData(getState, channel_id);
  if (!channel) {
    return null;
  }
  dispatch(selectedSymbol({symbol: channel.display_name}));
  dispatch(setActiveFocusChannel(channel_id));
  NavigationService.navigate('StockRoom', {
    title: parser(channel.display_name),
    create_at: channel.create_at,
    members: channel.members,
    fav: channel.fav,
    isAdminCreator: true,
  });
};

export const navigateToCryptoRoom = channel_id => (dispatch, getState) => {
  const {channel, onChannel} = getChannelData(getState, channel_id);
  if (!channel) {
    return null;
  }
  dispatch(selectedSymbol({symbol: channel.display_name}));
  dispatch(setActiveFocusChannel(channel_id));
  NavigationService.navigate('Room', {
    title: parser(channel.display_name),
    create_at: channel.create_at,
    members: channel.members,
    fav: channel.fav,
    isAdminCreator: true,
  });
};

export const navigateToChannelRoom = channel_id => (dispatch, getState) => {
  const {channel, onChannel} = getChannelData(getState, channel_id);
  if (!channel) {
    return null;
  }
  dispatch(selectedSymbol({symbol: channel.display_name}));
  dispatch(setActiveFocusChannel(channel_id));
  NavigationService.navigate('Channel', {
    title: parser(channel.display_name),
    create_at: channel.create_at,
    members: channel.members,
    fav: channel.fav,
    isAdminCreator: false,
  });
};