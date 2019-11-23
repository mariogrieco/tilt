import orderBy from 'lodash/orderBy';

export const GET_FEEDS_SUCCESS = 'GET_FEEDS_SUCCESS';

export const getFeeds = () => async dispatch => {
  try {
    const response = await fetch('https://staging.tiltchat.com/services/feed');
    const data = await response.json();
    const postsSortedByDate = orderBy(
      data.posts_keys,
      [key => data.posts[key].create_at],
      ['desc'],
    );
    dispatch({
      type: GET_FEEDS_SUCCESS,
      payload: {
        ...data,
        posts_keys: postsSortedByDate,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
