export const GET_FEES_SUCCESS = 'GET_FEES_SUCCESS';

export const getFess = () => async dispatch => {
  try {
    const response = await fetch('https://staging.tiltchat.com/services/feed');
    const data = await response.json();
    dispatch({
      type: GET_FEES_SUCCESS,
      payload: data,
    });
  } catch (err) {
    console.log(err);
  }
};
