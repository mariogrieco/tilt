import {
  SHOW_POST_MEDIA_BOX,
  HIDE_POST_MEDIA_BOX,
  CLOSED_POST_MEDIA_BOX,
} from '../actions/posts';

const initialState = {
  isVisible: false,
  uri: '',
  type: '',
  id: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_POST_MEDIA_BOX:
      return {isVisible: true, ...action.payload};
    case HIDE_POST_MEDIA_BOX:
      return {...state, isVisible: false};
    case CLOSED_POST_MEDIA_BOX:
      return initialState;
    default:
      return state;
  }
};
