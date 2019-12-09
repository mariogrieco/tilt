import orderBy from 'lodash/orderBy';
import {baseServicesUrl} from './../api/MattermostClient';
import {syncMultipleChannels} from './channels';
export const GET_FEEDS_SUCCESS = 'GET_FEEDS_SUCCESS';

export const getFeeds = () => async dispatch => {
  try {
    const response = await fetch(`${baseServicesUrl}/feed`);
    const data = await response.json();
    const postsSortedByDate = orderBy(
      data.posts_keys,
      [key => data.posts[key].create_at],
      ['desc'],
    );

    data.posts_keys = postsSortedByDate;

    await dispatch(syncMultipleChannels(data.channels_keys));

    dispatch({
      type: GET_FEEDS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    console.log('err feeds!', err);
  }
};
