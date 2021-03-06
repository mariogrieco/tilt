import Client4 from '../api/MattermostClient';
// import {
//   PER_PAGE_DEFAULT
// } from '../api/globals';

export const SEARCH_CHANNELS_SUCCESS = 'SEARCH_CHANNELS_SUCCESS';
export const SEARCH_CHANNELS_ERROR = 'SEARCH_CHANNELS_ERROR';

export const searchChannels = term => async (dispatch, getState) => {
  try {
    const results = await Client4.searchChannels(term);
    // console.log('results:', results);
    dispatch(searchChannelsSucess(results));
    return results;
  } catch (ex) {
    // console.log('ex:', ex);
    dispatch(searchChannelsError(ex));
    return Promise.reject(ex.message);
  }
};

export const searchMultiple = (terms = []) => async dispatch => {
  try {
    const searchs = [];
    terms.forEach(term => searchs.push(dispatch(searchChannels(term))));
    return await Promise.all(searchs);
  } catch (err) {
    console.log(err);
    return err;
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
