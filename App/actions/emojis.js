import Client4 from '../api/MattermostClient';

export const GET_CUSTOM_EMOJIS_SUCCESS = 'GET_CUSTOM_EMOJIS_SUCCESS';
export const GET_CUSTOM_EMOJIS_ERROR = 'GET_CUSTOM_EMOJIS_SUCCESS';

export const getCustomEmojis = () => async dispatch => {
  try {
    const emojis = await Client4.getCustomEmojis();
    dispatch(getCustomEmojisSucess(emojis));
    return emojis;
  } catch (ex) {
    dispatch(getCustomEmojisError(ex));
    return Promise.reject(ex.message);
  }
};

export const getCustomEmojisSucess = emojis => ({
  type: GET_CUSTOM_EMOJIS_SUCCESS,
  payload: emojis,
});

export const getCustomEmojisError = err => ({
  type: GET_CUSTOM_EMOJIS_ERROR,
  payload: err,
});
