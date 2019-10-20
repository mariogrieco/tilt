import {
  GET_CUSTOM_EMOJIS_SUCCESS
} from '../actions/emojis';

const initialState = [];

const emojis = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOM_EMOJIS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default emojis;
