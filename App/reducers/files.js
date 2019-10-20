import {
// GET_CHANNELS_SUCESS
} from '../actions/files';

const initialState = [];

const files = (state = initialState, action) => {
  switch (action.type) {
    // case GET_CHANNELS_SUCESS:
    //   return action.payload;
    default:
      return state;
  }
};

export default files;
