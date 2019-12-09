import {Alert} from 'react-native';

import Client4 from '../api/MattermostClient';
import {getPostsForChannel} from './posts';
import {setActiveFocusChannel} from './AppNavigation';
import {clearjumpToAction} from './advancedSearch';
import {openModal} from './channelJoinModalAlert';
import {selectedSymbol} from './symbols';

import NavigationService from './../config/NavigationService';
import {getFavoriteChannelById} from '../selectors/getFavoriteChannels';
import {PER_PAGE_DEFAULT} from '../api/globals';

import parser from '../utils/parse_display_name';

import moment from 'moment';

export const CREATE_CHANNEL_DIRECT_SUCCESS = 'CREATE_CHANNEL_DIRECT_SUCCESS';
export const CREATE_CHANNEL_DIRECT_ERROR = 'CREATE_CHANNEL_DIRECT_ERROR';

export const GET_CHANNELS = 'GET_CHANNELS';

export const GET_CHANNELS_SUCESS = 'GET_CHANNELS_SUCESS';
export const GET_CHANNELS_ERROR = 'GET_CHANNELS_ERROR';

export const GET_MY_CHANNELS_ERROR = 'GET_MY_CHANNELS_ERROR';
export const GET_MY_CHANNELS_SUCESS = 'GET_MY_CHANNELS_SUCESS';

export const REMOVE_FROM_CHANNEL_SUCESS = 'REMOVE_FROM_CHANNEL_SUCESS';
export const REMOVE_FROM_CHANNEL_ERROR = 'REMOVE_FROM_CHANNEL_ERROR';

export const ADD_TO_CHANNEL_SUCESS = 'ADD_TO_CHANNEL_SUCESS';
export const ADD_TO_CHANNEL_ERROR = 'ADD_TO_CHANNEL_ERROR';

export const CREATE_CHANNEL_SUCESS = 'CREATE_CHANNEL_SUCESS';
export const CREATE_CHANNEL_ERROR = 'CREATE_CHANNEL_ERROR';

export const SET_FAVORITE_CHANNEL_SUCCESS = 'SET_FAVORITE_CHANNEL_SUCCESS';
export const SET_FAVORITE_CHANNEL_ERROR = 'SET_FAVORITE_CHANNEL_ERROR';

export const DELETE_FAVORITE_CHANNEL_SUCCESS =
  'DELETE_FAVORITE_CHANNEL_SUCCESS';
export const DELETE_FAVORITE_CHANNEL_ERROR = 'DELETE_FAVORITE_CHANNEL_ERROR';

export const GET_CHANNELS_STATS_SUCCESS = 'GET_CHANNELS_STATS_SUCCESS';
export const GET_CHANNELS_STATS_ERROR = 'GET_CHANNELS_STATS_ERROR';

export const GET_CHANNELS_STATS_BY_GROUP_SUCCESS =
  'GET_CHANNELS_STATS_BY_GROUP_SUCCESS';
export const GET_CHANNELS_STATS_BY_GROUP_ERROR =
  'GET_CHANNELS_STATS_BY_GROUP_ERROR';

export const GET_CHANNEL_BY_ID_SUCCESS = 'GET_CHANNEL_BY_ID_SUCCESS';
export const GET_CHANNEL_BY_ID_ERROR = 'GET_CHANNEL_BY_ID_ERROR';

export const UPDATE_CHANNEL_HEADER_SUCCESS = 'UPDATE_CHANNEL_HEADER_SUCCESS';
export const UPDATE_CHANNEL_HEADER_ERROR = 'UPDATE_CHANNEL_HEADER_ERROR';

export const UPDATE_PURPOSE_SUCCESS = 'UPDATE_PURPOSE_SUCCESS';
export const UPDATE_PURPOSE_ERROR = 'UPDATE_PURPOSE_ERROR';

export const UPDATE_NAME_SUCCESS = 'UPDATE_NAME_SUCCESS';
export const UPDATE_NAME_ERROR = 'UPDATE_NAME_ERROR';

export const CHANNEL_UPDATED_SUCCESS = 'CHANNEL_UPDATED_SUCCESS';

export const VIEW_CHANNEL_SUCCESS = 'VIEW_CHANNEL_SUCCESS';
export const VIEW_CHANNEL_ERROR = 'VIEW_CHANNEL_ERROR';

export const GET_LAST_VIEW_FOR_CHANNELS_SUCCESS =
  'GET_LAST_VIEW_FOR_CHANNELS_SUCCESS';
export const GET_LAST_VIEW_FOR_CHANNELS_ERROR =
  'GET_LAST_VIEW_FOR_CHANNELS_ERROR';

export const PATCH_CHANNEL_SUCCESS = 'PATCH_CHANNEL_SUCCESS';
export const PATCH_CHANNEL_ERROR = 'PATCH_CHANNEL_ERROR';

export const SET_CHANNEL_PAGINATOR = 'SET_CHANNEL_PAGINATOR';

export const GET_CHANNEL_BY_NAME_SUCCESS = 'GET_CHANNEL_BY_NAME_SUCCESS';
export const GET_CHANNEL_BY_NAME_ERROR = 'GET_CHANNEL_BY_NAME_ERROR';

export const GET_MY_CHANNEL_BY_ID_SUCCESS = 'GET_MY_CHANNEL_BY_ID_SUCCESS';

export const DELETE_CHANNEL_SUCCESS = 'DELETE_CHANNEL_SUCCESS';
export const DELETE_CHANNEL_ERROR = 'DELETE_CHANNEL_ERROR';

export const GET_MUTE_UNMUTE_PREFERENCES_SUCCESS =
  'GET_MUTE_UNMUTE_PREFERENCES_SUCCESS';
export const GET_MUTE_UNMUTE_PREFERENCES_ERROR =
  'GET_MUTE_UNMUTE_PREFERENCES_ERROR';

export const deleteChannel = channelId => async dispatch => {
  try {
    const response = await Client4.deleteChannel(channelId);
    dispatch(
      deleteChannelSucess({
        channelId,
      }),
    );
    // NavigationService.navigate('PublicChat');
    return response;
  } catch (ex) {
    dispatch(deleteChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const deleteChannelSucess = data => ({
  type: DELETE_CHANNEL_SUCCESS,
  payload: data,
});

export const deleteChannelError = err => ({
  type: DELETE_CHANNEL_ERROR,
  payload: err,
});

export const setChannelPaginator = payload => ({
  payload,
  type: SET_CHANNEL_PAGINATOR,
});

export const patchChannel = (channelId, channelPatch) => async dispatch => {
  try {
    const name = channelPatch.name;
    const response = await Client4.patchChannel(channelId, {
      purpose: channelPatch.purpose,
      header: channelPatch.header,
      name: name,
    });
    dispatch(patchChannelSucess(response));
    return response;
  } catch (ex) {
    dispatch(patchChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const patchChannelSucess = data => ({
  type: PATCH_CHANNEL_SUCCESS,
  payload: data,
});

export const patchChannelError = err => ({
  type: PATCH_CHANNEL_ERROR,
  payload: err,
});

export const navigateIfExists = (
  channelDisplayName,
  channel_id,
  direct,
  props = {},
) => async (dispatch, getState) => {
  const state = getState();
  const MyMapChannel = state.myChannelsMap;
  const channels = state.mapChannels.valueSeq();
  const whoIam = state.login.user ? state.login.user.id : null;
  const users = state.users;
  let exists = false;
  if (channel_id && !channelDisplayName) {
    let channel = state.mapChannels.get(channel_id);
    if (channel) {
      channelDisplayName = `${channel.content_type !== 'N' ? '$' : '#'}${
        channel.display_name
      }`;
      if (channel.type === 'D') {
        channelDisplayName = channel.name;
      }
    }
  }

  channels.forEach(async item => {
    let formatName = item.display_name;
    if (item.type === 'D') {
      formatName = item.name;
    }
    let symbolType = '';
    if (item.content_type === 'S') {
      symbolType = 'StockRoom';
    } else if (item.content_type === 'C') {
      symbolType = 'Room';
    } else if (item.content_type === 'N' && item.type === 'D') {
      symbolType = 'Channel';
    } else if (item.content_type === 'N') {
      symbolType = 'Channel';
    }
    if (parser(formatName) === parser(channelDisplayName)) {
      exists = true;
      const joined = MyMapChannel.get(item.id);
      if (joined) {
        const isPM = item.type === 'D';
        if (isPM) {
          formatName = formatName.replace(whoIam, '').replace('__', '');
          formatName = users.data[formatName]
            ? users.data[formatName].username
            : '';
        }
        dispatch(setActiveFocusChannel(item.id));
        if (item.content_type !== 'N') {
          dispatch(selectedSymbol({symbol: item.display_name}));
        }
        NavigationService.navigate(symbolType, {
          title: formatName,
          create_at: item.create_at,
          members: item.members,
          fav: getFavoriteChannelById(state, item.id),
          focusOn: false,
          isAdminCreator: channelDisplayName[0] === '$',
          pm: isPM,
          ...props,
        });
      } else {
        if (direct) {
          await dispatch(addToChannel(whoIam, item.id));
          dispatch(setActiveFocusChannel(item.id));
          if (item.content_type !== 'N') {
            dispatch(selectedSymbol({symbol: item.display_name}));
          }
          NavigationService.navigate(symbolType, {
            title: formatName,
            create_at: item.create_at,
            members: item.members,
            fav: getFavoriteChannelById(state, item.id),
            focusOn: false,
            isAdminCreator: channelDisplayName[0] === '$',
            pm: item.type === 'D',
            ...props,
          });
        } else {
          dispatch(openModal(item.id));
        }
      }
    }
  });
  if (!exists) {
    try {
      let r = {};
      if (channelDisplayName) {
        r = await Client4.getChannelByNameService(
          channelDisplayName.replace('$', '').replace('#', ''),
        );
      } else {
        r = await Client4.getChannel(channel_id);
      }
      if (r.channel) {
        let symbolType = '';
        if (r.channel.content_type === 'S') {
          symbolType = 'StockRoom';
        } else if (r.channel.content_type === 'C') {
          symbolType = 'Room';
        } else if (r.channel.content_type === 'N' && r.channel.type === 'D') {
          symbolType = 'Channel';
        }
        if (direct) {
          dispatch(getChannelsSucess([r.channel]));
          await dispatch(addToChannel(whoIam, r.channel.id));
          dispatch(setActiveFocusChannel(r.channel.id));
          if (r.channel.content_type !== 'N') {
            dispatch(selectedSymbol({symbol: r.channel.display_name}));
          }
          NavigationService.navigate(symbolType, {
            title: parser(r.channel.display_name),
            create_at: r.channel.create_at,
            members: r.channel.members,
            fav: getFavoriteChannelById(state, r.channel.id),
            focusOn: false,
            isAdminCreator: channelDisplayName[0] === '$',
            pm: r.channel.type === 'D',
            ...props,
          });
        } else {
          dispatch(getChannelsSucess([r.channel]));
          dispatch(openModal(r.channel.id));
        }
      } else {
        const needAdminCredentials = channelDisplayName[0] === '$';
        const isAdmin = state.adminCreators.includes(whoIam);
        if (needAdminCredentials && !isAdmin) {
          // eslint-disable-next-line no-alert
          alert('This symbol does not exist.');
        } else if (needAdminCredentials && isAdmin) {
          if (direct) {
            naviteNavigation(channelDisplayName, props);
          } else {
            showNativeAlert(channelDisplayName);
          }
        } else if (!needAdminCredentials) {
          if (direct) {
            naviteNavigation(channelDisplayName, props);
          } else {
            showNativeAlert(channelDisplayName);
          }
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e);
    }
  }
};

function naviteNavigation(channelDisplayName, props) {
  NavigationService.navigate('CreateChannel', {
    active_name: channelDisplayName.replace('$', '').replace('#', ''),
    ...props,
  });
}

function showNativeAlert(channelDisplayName) {
  Alert.alert(
    '',
    'This channel does not exist. Would you like to create this channel?',
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          NavigationService.navigate('CreateChannel', {
            active_name: channelDisplayName.replace('$', '').replace('#', ''),
          });
        },
        style: 'default',
      },
    ],
    {cancelable: false},
  );
}

function getViewChannelSchema(channelId, userId, value) {
  return {
    category: 'channel_approximate_view_time',
    name: channelId,
    user_id: userId,
    value: value ? value : `${moment().valueOf()}`,
  };
}

export const getChannelByName = channelName => async (dispatch, getState) => {
  try {
    const {channel} = await Client4.getChannelByNameService(channelName);
    if (channel) {
      dispatch(getChannelByNameSuccess(channel));
    }
    return channel;
  } catch (ex) {
    dispatch(getChannelByNameError(ex.message || ex));
    return Promise.reject(ex.message || ex);
  }
};

export const getChannelByNameSuccess = channel => ({
  type: GET_CHANNEL_BY_NAME_SUCCESS,
  payload: channel,
});

export const getChannelByNameError = message => ({
  type: GET_CHANNEL_BY_NAME_ERROR,
  payload: message,
});

export const getMuteUnMutePreferences = () => async (dispatch, getState) => {
  try {
    const team_id = getState().teams.default_team_id;
    const results = await Client4.getMyChannelMembers(team_id);
    const result_dic = {};

    results.forEach(data => {
      result_dic[data.channel_id] = data;
    });

    dispatch(getMuteUnMutePreferencesSucces(result_dic));
    return result_dic;
  } catch (ex) {
    dispatch(getMuteUnMutePreferencesError(ex));
    return Promise.reject(ex);
  }
};

export const getMuteUnMutePreferencesSucces = data => ({
  type: GET_MUTE_UNMUTE_PREFERENCES_SUCCESS,
  payload: data,
});

export const getMuteUnMutePreferencesError = message => ({
  type: GET_MUTE_UNMUTE_PREFERENCES_ERROR,
  payload: message,
});

export const getLastViewForChannels = () => async (dispatch, getState) => {
  try {
    const team_id = getState().teams.default_team_id;
    const results = await Client4.getMyChannelMembers(team_id);
    const result_dic = {};

    results.forEach(data => {
      result_dic[data.channel_id] = data.last_viewed_at;
    });

    dispatch(getLastViewForChannelsSucess(result_dic));

    return result_dic;
  } catch (ex) {
    dispatch(getLastViewForChannelsError(ex.message));
    return Promise.reject(ex.message);
  }
};

export const getLastViewForChannelsSucess = data => ({
  type: GET_LAST_VIEW_FOR_CHANNELS_SUCCESS,
  payload: data,
});

export const getLastViewForChannelsError = message => ({
  type: GET_LAST_VIEW_FOR_CHANNELS_ERROR,
  payload: message,
});

export const setViewChannel = (channelId, prevChannelId) => async dispatch => {
  try {
    const payload = await Client4.viewMyChannel(channelId, prevChannelId);
    dispatch(setViewChannelSucess(payload));
    dispatch(
      getLastViewForChannelsSucess({
        [channelId]: payload.last_viewed_at_times[channelId],
      }),
    );
    return payload;
  } catch (ex) {
    dispatch(setViewChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const setViewChannelSucess = payload => ({
  type: VIEW_CHANNEL_SUCCESS,
  payload,
});

export const setViewChannelError = err => ({
  type: VIEW_CHANNEL_ERROR,
  payload: err,
});

export const channelUpdated = newChannel => ({
  type: CHANNEL_UPDATED_SUCCESS,
  payload: newChannel,
});

export const verifyChannelUpdates = post => dispatch => {
  switch (post.type) {
    case 'system_header_change': {
      return dispatch({
        type: UPDATE_CHANNEL_HEADER_SUCCESS,
        payload: post,
      });
    }
    case 'system_purpose_change': {
      return dispatch({
        type: UPDATE_PURPOSE_SUCCESS,
        payload: post,
      });
    }
    case 'system_displayname_change': {
      return dispatch({
        type: UPDATE_NAME_SUCCESS,
        payload: post,
      });
    }
    default: {
      return null;
    }
  }
};

export const getChannelById = (channelId, meChannel) => async (
  dispatch,
  getState,
) => {
  try {
    const meId = getState().login.user.id;
    const {channel} = await Client4.getChannel(channelId);

    if ((channel && meChannel) || (channel && channel.creator_id === meId)) {
      dispatch(getMyChannelByIdSucess(channel, meId));
    }
    if (channel) {
      dispatch(getChannelByIdSucess(channel));
    }
    await dispatch(getPostsForChannel(channel.id));
    return channel;
  } catch (ex) {
    dispatch(getChannelByIdError(ex));
    return null;
  }
};

export const syncMultipleChannels = (channelIds = []) => async (
  dispatch,
  getState,
) => {
  try {
    const mapChannels = getState().mapChannels;
    const myChannelsMap = getState().myChannelsMap;

    const syncChannels = [];

    channelIds.forEach(id => {
      if (!(mapChannels.has(id) || myChannelsMap.has(id))) {
        syncChannels.push(dispatch(getChannelById(id)));
      }
    });

    const result = await Promise.all(syncChannels);

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getMyChannelByIdSucess = (channel, meId) => ({
  type: GET_MY_CHANNEL_BY_ID_SUCCESS,
  payload: {
    channel,
    meId,
  },
});

export const getChannelByIdSucess = channel => ({
  type: GET_CHANNEL_BY_ID_SUCCESS,
  payload: channel,
});

export const getChannelByIdError = err => ({
  type: GET_CHANNEL_BY_ID_ERROR,
  payload: err,
});

function getFavoritePreference(channel_id, user_id) {
  return [
    {
      category: 'favorite_channel',
      name: channel_id,
      value: 'true',
      user_id,
    },
  ];
}

export const getChannelStats = channelId => async dispatch => {
  try {
    const stats = await Client4.getChannelStats(channelId);
    dispatch(getChannelStatsSucess(stats));
    return stats;
  } catch (ex) {
    dispatch(getChannelStatsError(ex));
    return Promise.reject(ex.message);
  }
};

export const getChannelStatsSucess = stats => ({
  type: GET_CHANNELS_STATS_SUCCESS,
  payload: stats,
});

export const getChannelStatsError = err => ({
  type: GET_CHANNELS_STATS_ERROR,
  payload: err,
});

export const getChannelStatsByGroup = channels => async (
  dispatch,
  getState,
) => {
  const ids = [];
  try {
    channels = channels ? channels : getState().mapChannels.valueSeq();
    channels.forEach(channel => ids.push(channel.id));
    const results = await Client4.getMemberCount(ids);
    dispatch(getChannelStatsByGroupSuccess(results));
  } catch (err) {
    dispatch(getChannelStatsByGroupError(err));
    console.log(err);
  }
};

const getChannelStatsByGroupSuccess = stats => ({
  type: GET_CHANNELS_STATS_BY_GROUP_SUCCESS,
  payload: stats,
});

const getChannelStatsByGroupError = err => ({
  type: GET_CHANNELS_STATS_BY_GROUP_ERROR,
  payload: err,
});

export const deleteFavoriteChannel = (userId, channel_id) => async dispatch => {
  try {
    const preferences = getFavoritePreference(channel_id, userId);
    await Client4.deletePreferences(userId, preferences);
    dispatch(deleteFavoriteChannelSucess(preferences));
    return preferences;
  } catch (ex) {
    dispatch(deleteFavoriteChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const deleteFavoriteChannelSucess = preferences => ({
  type: DELETE_FAVORITE_CHANNEL_SUCCESS,
  payload: preferences,
});

export const deleteFavoriteChannelError = err => ({
  type: DELETE_FAVORITE_CHANNEL_ERROR,
  payload: err,
});

export const setFavoriteChannel = (user_id, channel_id) => async dispatch => {
  try {
    const preferences = getFavoritePreference(channel_id, user_id);
    await Client4.savePreferences(user_id, preferences);
    dispatch(setFavoriteChannelSucess(preferences));
    return preferences;
  } catch (ex) {
    dispatch(setFavoriteChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const setFavoriteChannelSucess = preference => ({
  type: SET_FAVORITE_CHANNEL_SUCCESS,
  payload: preference,
});

export const setFavoriteChannelError = err => ({
  type: SET_FAVORITE_CHANNEL_ERROR,
  payload: err,
});

// {title: "name", purpose: "purpose", header: "header"}

function getChannelSchema({header, title, purpose, team_id, display_name}) {
  return {
    display_name,
    header,
    name: parser(title),
    purpose,
    team_id,
    type: 'O',
  };
}

export const createChannel = data => async (dispatch, getState) => {
  try {
    data.team_id = getState().teams.default_team_id;
    const payload = await Client4.createChannel(getChannelSchema(data));
    dispatch(createChannelSucess(payload));
    dispatch(getPostsForChannel(payload.id));
    return payload;
  } catch (ex) {
    dispatch(createChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const createChannelSucess = channel => ({
  type: CREATE_CHANNEL_SUCESS,
  payload: channel,
});

export const createChannelError = err => ({
  type: CREATE_CHANNEL_ERROR,
  payload: err,
});

export const addToChannel = (user_id, channel_id, postRootId) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    await Client4.addToChannel(user_id, channel_id, postRootId);
    const channel = state.mapChannels.get(channel_id);
    if (channel) {
      dispatch(addToChannelSucess(channel));
      dispatch(getPostsForChannel(channel.id));
      console.log(channel);
    }
    return channel;
  } catch (ex) {
    dispatch(addToChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const addToChannelSucess = channel => ({
  type: ADD_TO_CHANNEL_SUCESS,
  payload: channel,
});

export const addToChannelError = err => ({
  type: ADD_TO_CHANNEL_ERROR,
  payload: err,
});

export const removeFromChannel = (user_id, channel_id) => async dispatch => {
  try {
    await Client4.removeFromChannel(user_id, channel_id);
    dispatch(removeFromChannelSucess(channel_id));
    return channel_id;
  } catch (ex) {
    dispatch(removeFromChannelError(ex));
    return Promise.reject(ex.message);
  }
};

export const removeFromChannelSucess = channel_id => ({
  type: REMOVE_FROM_CHANNEL_SUCESS,
  payload: channel_id,
});

export const removeFromChannelError = err => ({
  type: REMOVE_FROM_CHANNEL_ERROR,
  payload: err,
});

export const createAndRedirectDirect = userIds => async dispatch => {
  try {
    dispatch(createDirectChannel(userIds));
  } catch (err) {
    return Promise.reject(err.message || err);
  }
};

export const createDirectChannel = userId => async (dispatch, getState) => {
  try {
    dispatch(clearjumpToAction());
    const channels = getState().mapChannels;
    const meId = getState().login.user.id;
    const comparator = `${userId}`;
    let channel = null;

    getState()
      .myChannelsMap.keySeq()
      .find(id => {
        const _channel = channels.get(id);
        if (_channel && _channel.name.includes(comparator)) {
          channel = _channel;
        }
        return false;
      });

    if (!channel) {
      const r = await Client4.createDirectChannel([meId, userId]);
      dispatch(createDirectChannelSucess(r));
      dispatch(getChannelByIdSucess(r));
      dispatch(getMyChannelByIdSucess(r));
      channel = r;
    }

    dispatch(setActiveFocusChannel(channel.id));
    NavigationService.navigate('Channel', {
      title: getState().users.data[userId]
        ? getState().users.data[userId].username
        : '',
      create_at: channel.create_at,
      members: channel.members,
      fav: getFavoriteChannelById(getState(), channel.id),
      pm: true,
      focusOn: false,
    });
    return channel;
  } catch (ex) {
    dispatch(createDirectChannelError(ex));
    return Promise.reject(ex.message || ex);
  }
};

export const createDirectChannelSucess = channels => ({
  type: CREATE_CHANNEL_DIRECT_SUCCESS,
  payload: channels,
});

export const createDirectChannelError = err => ({
  type: CREATE_CHANNEL_DIRECT_ERROR,
  payload: err,
});

export const getMyChannels = () => async (dispatch, getState) => {
  try {
    const meId = getState().login.user.id;
    const payload = await Client4.getMyChannels(meId);
    dispatch(getMyChannelsSucess(payload));
    return payload;
  } catch (ex) {
    dispatch(getMyChannelsError(ex));
    return Promise.reject(ex.message);
  }
};

export const getMyChannelsSucess = channels => ({
  type: GET_MY_CHANNELS_SUCESS,
  payload: channels,
});

export const getMyChannelsError = err => ({
  type: GET_MY_CHANNELS_ERROR,
  payload: err,
});

// getMemberCount

export const getChannels = (
  page = 0,
  perPage = PER_PAGE_DEFAULT,
) => async dispatch => {
  try {
    // const teams = await Client4.getMyTeams();
    const payload = [];
    // const asyncCalls = [];
    // let results = [];

    // for (const team of teams) {
    //   // asyncCalls.push(Client4.getChannels(team.id, page, perPage));
    // }

    // results = await Promise.all(asyncCalls);
    // results.forEach(result => {
    //   if (result) {
    //     result.forEach(channel => {
    //       payload.push(channel);
    //     });
    //   }
    // });

    // dispatch(getChannelsSucess(payload));
    return [];
  } catch (ex) {
    dispatch(getChannelsError(ex));
    return Promise.reject(ex.message);
  }
};

export const getChannelsSucess = channels => {
  return {
    type: GET_CHANNELS_SUCESS,
    payload: channels || [],
  };
};

export const getChannelsError = err => ({
  type: GET_CHANNELS_ERROR,
  payload: err,
});
