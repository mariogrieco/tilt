export const SET_REPOST_ACTIVE_ON_INPUT = 'SET_REPOST_ACTIVE_ON_INPUT';

export const setRepostActiveOnInput = base_post_id => dispatch => {
  dispatch({
    type: SET_REPOST_ACTIVE_ON_INPUT,
    payload: base_post_id,
  });
};
