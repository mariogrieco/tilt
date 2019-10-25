import {SET_CURRENT_DISPLAY_USER_PROFILE} from '../actions/users';

const initialState = {userId: null};

const displayUserProfile = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_DISPLAY_USER_PROFILE:
      return {userId: action.payload};
    default:
      return state;
  }
};

export default displayUserProfile;
