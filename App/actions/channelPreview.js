import Client4 from '../api/MattermostClient';

export const GET_CHANNEL_PREVIEW_SUCCESS = 'GET_CHANNEL_PREVIEW_SUCCESS';
export const GET_CHANNEL_PREVIEW_ERROR = 'GET_CHANNEL_PREVIEW_ERROR';

export const getChanelPreview = channel_id => async dispatch => {
  try {
    const data = await Client4.getChannelPreview(channel_id);
    dispatch(getChannelPreviewSuccess(data, channel_id));
    return data;
  } catch (ex) {
    dispatch(getChannelPreviewError(ex));
    return Promise.reject(ex);
  }
};

export const getChannelPreviewError = err => ({
  payload: err,
  type: GET_CHANNEL_PREVIEW_ERROR,
});

export const getChannelPreviewSuccess = (posts, channel_id) => ({
  payload: {
    posts,
    channel_id,
  },
  type: GET_CHANNEL_PREVIEW_SUCCESS,
});
