import Client4 from '../api/MattermostClient';
// import {
//   PER_PAGE_DEFAULT
// } from '../api/globals';

export const SEARCH_CHANNELS_SUCCESS = 'SEARCH_CHANNELS_SUCCESS';
export const SEARCH_CHANNELS_ERROR = 'SEARCH_CHANNELS_ERROR';

export const searchChannels = (_XX, term) => async (dispatch, getState) => {
  try {
    const team_id = getState().teams.default_team_id;
    const results = await Client4.searchChannels(team_id, term);
    const channelsFilter = results.filter(channel => channel.delete_at === 0);
    dispatch(searchChannelsSucess(channelsFilter));
    return channelsFilter;
  } catch (ex) {
    dispatch(searchChannelsError(ex));
    return Promise.reject(ex.message);
  }
};

export const searchChannelsSucess = results => ({
  type: SEARCH_CHANNELS_SUCCESS,
  payload: results,
});

export const searchChannelsError = err => ({
  type: SEARCH_CHANNELS_ERROR,
  payload: err,
});
