export const SET_CONNECTING_STATE = 'SET_CONNECTING_STATE';
export const SET_RECONNECT_STATE = 'SET_RECONNECTING_STATE';
export const SET_ERROR_STATE = 'SET_ERROR_STATE';
export const SET_CLOSE_STATE = 'SET_CLOSE_STATE';
export const SET_CONNECTED_STATE = 'SET_CONNECTED_STATE';

export const setConnectedState = msg => ({
  type: SET_CONNECTED_STATE,
  payload: msg,
});

export const setConnectingState = msg => ({
  type: SET_CONNECTING_STATE,
  payload: msg,
});

export const setCloseState = msg => ({
  type: SET_CLOSE_STATE,
  payload: msg,
});

export const setErrorState = msg => ({
  type: SET_ERROR_STATE,
  payload: msg,
});

export const setReconnectState = msg => ({
  type: SET_RECONNECT_STATE,
  payload: msg,
});
