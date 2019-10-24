import {SET_NEW_ADMIN_CREATORS} from '../actions/adminCreators';

const initialState = '1kthux5ahbrfxc5md56way6q7o,';

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_NEW_ADMIN_CREATORS: {
      return payload;
    }
    default: {
      return state;
    }
  }
};
