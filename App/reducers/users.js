import {
  GET_USERS_SUCESS,
  USER_UPDATED_SUCCESS,
  GET_NEW_USER_SUCCESS,
  SET_CURRENT_DISPLAY_USER_PROFILE,
} from '../actions/users';
import {LOGIN_SUCCESS, LOGOUT_SUCESS} from '../actions/login';
import mergeWith from 'lodash/mergeWith';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import moment from 'moment';

const initialState = {
  keys: [],
  data: {},
  currentUserIdProfile: '',
};
function customizer(objValue, srcValue) {
  if (!isEmpty(srcValue)) {
    return srcValue;
  } else {
    return objValue;
  }
}

const users = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_SUCESS: {
      return {
        keys: [],
        data: {},
      };
    }
    case LOGIN_SUCCESS: {
      const nextState = cloneDeep(state);
      nextState.data[action.payload.id] = action.payload;
      nextState.keys = Object.keys(nextState.data);
      return nextState;
    }
    case GET_NEW_USER_SUCCESS: {
      const nextState = cloneDeep(state);
      nextState.data[action.payload.id] = action.payload;
      nextState.keys = Object.keys(nextState.data);
      return nextState;
    }
    case USER_UPDATED_SUCCESS: {
      const nextState = cloneDeep(state);
      mergeWith(nextState.data[action.payload.id], action.payload, customizer);
      if (nextState.data[action.payload.id]) {
        nextState.data[action.payload.id].last_picture_update = moment().unix();
      }
      return nextState;
    }
    case GET_USERS_SUCESS: {
      const nextState = cloneDeep(state);
      action.payload.forEach(user => {
        nextState.data[user.id] = user;
      });
      nextState.keys = Object.keys(nextState.data);
      return nextState;
    }
    case SET_CURRENT_DISPLAY_USER_PROFILE: {
      return {...cloneDeep(state), currentUserIdProfile: action.payload};
    }
    default:
      return state;
  }
};

export default users;
