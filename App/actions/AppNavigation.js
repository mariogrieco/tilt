export const SET_ACTIVE_FOCUS_CHANNEL_ID = 'SET_ACTIVE_FOCUS_CHANNEL_ID';
export const SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID =
  'SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID';

export const SET_ACTIVE_THREAD_DATA = 'SET_ACTIVE_THREAD_DATA';

export const SET_ACTIVE_EDIT_POST_ID = 'SET_ACTIVE_EDIT_POST_ID';

export const setActiveFocusChannel = id => ({
  payload: id,
  type: SET_ACTIVE_FOCUS_CHANNEL_ID,
});

export const setActiveDetailsFocusChannel = id => ({
  payload: id,
  type: SET_ACTIVE_DETAILS_FOCUS_CHANNEL_ID,
});

export const setActiveThreadData = data => ({
  payload: data,
  type: SET_ACTIVE_THREAD_DATA,
});

export const setActiveEditPostId = id => ({
  payload: id,
  type: SET_ACTIVE_EDIT_POST_ID,
});
