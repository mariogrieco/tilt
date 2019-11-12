import Client4 from '../api/MattermostClient';

export const GET_MY_PREFERENCES_SUCCESS = 'GET_MY_PREFERENCES_SUCCESS';
export const GET_MY_PREFERENCES_ERROR = 'GET_MY_PREFERENCES_ERROR';

export const UPDATE_CHANNEL_NOTIFY_PROPS_SUCCESS = 'UPDATE_CHANNEL_NOTIFY_PROPS_SUCCESS';
export const UPDATE_CHANNEL_NOTIFY_PROPS_ERROR = 'UPDATE_CHANNEL_NOTIFY_PROPS_ERROR';

export const getMyPreferences = () => async dispatch => {
  try {
    const result = await Client4.getMyPreferences();
    dispatch(getMyPreferencesSucess(result));
  } catch (ex) {
    dispatch(getMyPreferencesError(ex));
    return Promise.reject(ex.message);
  }
};

export const getMyPreferencesSucess = users => ({
  type: GET_MY_PREFERENCES_SUCCESS,
  payload: users,
});

export const getMyPreferencesError = err => ({
  type: GET_MY_PREFERENCES_ERROR,
  payload: err,
});

export const muteChannelAction = (channel_id, user_id) => dispatch => {
  return dispatch(
    updateChannelNotifyProps({
      channel_id,
      mark_unread: 'mention',
      user_id,
    }),
  );
};

export const unmuteChannelAction = (channel_id, user_id) => dispatch => {
  return dispatch(
    updateChannelNotifyProps({
      channel_id,
      mark_unread: 'all',
      user_id,
    }),
  );
};

export const updateChannelNotifyProps = props => async dispatch => {
  try {
    const result = await Client4.updateChannelNotifyProps(props);
    dispatch(updateChannelNotifyPropsSucess(result));
    return result;
  } catch (ex) {
    dispatch(updateChannelNotifyPropsError(ex));
    return Promise.reject(ex);
  }
};

export const updateChannelNotifyPropsSucess = users => ({
  type: UPDATE_CHANNEL_NOTIFY_PROPS_SUCCESS,
  payload: users,
});

export const updateChannelNotifyPropsError = err => ({
  type: UPDATE_CHANNEL_NOTIFY_PROPS_ERROR,
  payload: err,
});
