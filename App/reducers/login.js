import {
  IS_LOGIN,
  LOGIN_SUCCESS,
  USER_LOGIN,
  MODAL_ACTIVE,
  LOGOUT_SUCESS
} from '../actions/login';
import {
  CREATE_USER_SUCESS
} from '../actions/signup';
import {
  USER_UPDATED_SUCCESS
} from '../actions/users';
import {
  mergeWith,
  isEmpty
} from 'lodash';
import NavigationService from '../config/NavigationService';
import moment from 'moment';

const initialState = {
  isLogin: false,
  modalActive: false,
  user: null
};

function customizer(objValue, srcValue) {
  if (!isEmpty(srcValue)) {
    return srcValue;
  } else {
    return objValue;
  };
};

const login = (state = initialState, action) => {
  if (action.type.includes('_ERROR')) {
    if (action.payload && action.payload.server_error_id === 'api.context.session_expired.app_error') {
      setTimeout(() => {
        NavigationService.navigate('SignUp');
      }, 0);
      return {
        ...state,
        isLogin: false,
        user: null
      }
    };
  }

  switch (action.type) {
    case USER_UPDATED_SUCCESS: {
      if (!state.user) {
        return state;
      }
      const nextState = { ...state };
      if (action.payload.id === state.user.id) {
        mergeWith(nextState.user, action.payload, customizer);
        nextState.user.last_picture_update = moment().unix();
      }
      return nextState;
    }
    case CREATE_USER_SUCESS: {
      return {
        ...state,
        user: action.payload
      };
    }
    case LOGOUT_SUCESS: {
      return {
        // user: null,
        isLogin: false
      };
    }
    case IS_LOGIN:
      return {
        ...state,
        isLogin: action.payload,
        user: action.payload ? state.user : null
      };
    case MODAL_ACTIVE:
      return {
        ...state,
        modalActive: action.payload
      };
    case USER_LOGIN:
      return {
        ...state,
        user: action.payload
      };
    case LOGIN_SUCCESS: {
      return {
        ...state,
        user: action.payload
      };
    }
    default:
      return state;
  }
};

export default login;