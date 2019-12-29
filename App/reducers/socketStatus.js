import {
  SET_RECONNECT_STATE,
  SET_CONNECTING_STATE,
  SET_ERROR_STATE,
  SET_CLOSE_STATE,
  SET_CONNECTED_STATE,
} from '../actions/socketStatus';

const initialState = {
  connected: null,
  reconecting: false,
  error: null,
  conecting: null,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CONNECTING_STATE: {
      return {
        ...state,
        conecting: true,
        connected: false,
        error: null,
      };
    }
    case SET_RECONNECT_STATE: {
      return {
        ...state,
        conecting: false,
        connected: true,
        error: null,
      };
    }
    case SET_CONNECTED_STATE: {
      return {
        ...state,
        connected: true,
        conecting: false,
        error: null,
      };
    }
    case SET_CLOSE_STATE: {
      return {
        ...state,
        connected: null,
        conecting: false,
        error: null,
      };
    }
    case SET_ERROR_STATE: {
      return {
        ...state,
        connected: null,
        conecting: false,
        error: payload,
      };
    }
    default: {
      return state;
    }
  }
};
