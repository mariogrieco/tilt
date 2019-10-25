import {
  // GET_MY_PREFERENCES_ERROR,
  GET_MY_PREFERENCES_SUCCESS,
} from '../actions/preferences';
import {
  // DELETE_FAVORITE_CHANNEL_ERROR,
  DELETE_FAVORITE_CHANNEL_SUCCESS,
  SET_FAVORITE_CHANNEL_SUCCESS,
  // SET_FAVORITE_CHANNEL_ERROR,
} from '../actions/channels';

const initialState = [];

const preferences = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_FAVORITE_CHANNEL_SUCCESS: {
      const nextState = [...state];
      return nextState.filter(preference => {
        const current = action.payload[0];
        return !(
          preference.category === current.category &&
          preference.name === current.name &&
          preference.user_id === current.user_id &&
          preference.value === current.value
        );
      });
    }
    case SET_FAVORITE_CHANNEL_SUCCESS: {
      const nextState = [...state];
      nextState.push(action.payload[0]);
      return nextState;
    }
    case GET_MY_PREFERENCES_SUCCESS: {
      return action.payload;
    }
    default:
      return state;
  }
};

export default preferences;
