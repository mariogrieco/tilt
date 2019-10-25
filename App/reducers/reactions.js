import {ADD_REACTION_SUCCESS} from '../actions/reactions';

const initialState = [];

const reactions = (state = initialState, action) => {
  switch (action.type) {
    case ADD_REACTION_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default reactions;
