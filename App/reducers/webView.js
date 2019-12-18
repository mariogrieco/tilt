import {SET_WEB_VIEW_URI} from '../actions/webView';

const initialState = null;

const webView = (state = initialState, {payload, type}) => {
  switch (type) {
    case SET_WEB_VIEW_URI:
      return payload;
    default:
      return state;
  }
};

export default webView;
