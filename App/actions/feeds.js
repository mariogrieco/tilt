export const GET_FEEDS_SUCCESS = 'GET_FEEDS_SUCCESS';

export const getFeeds = () => async dispatch => {
  try {
    const response = await fetch('https://staging.tiltchat.com/services/feed');
    const data = await response.json();
    dispatch({
      type: GET_FEEDS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    console.log(err);
  }
};
