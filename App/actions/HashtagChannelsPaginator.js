import Client4 from '../api/MattermostClient';

export const GET_PAGE_SUCCESS = 'GET_PAGE_SUCCESS';
export const GET_PAGE_ERROR = 'GET_PAGE_ERROR';

export const getHashtagChannels = page => async dispatch => {
  try {
    const channels = await Client4.getHashtagChannels(page, 50);
    dispatch(getHashtagChannelsSucess({channels, page: ++page}));
    return channels;
  } catch (ex) {
    dispatch(getHashtagChannelsError(ex));
    return Promise.reject(ex.message);
  }
};

const getHashtagChannelsSucess = payload => ({
  type: GET_PAGE_SUCCESS,
  payload,
});

const getHashtagChannelsError = ex => ({
  type: GET_PAGE_ERROR,
  payload: ex,
});
