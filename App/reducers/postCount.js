import {GET_POST_COUNT_SUCCESS} from '../actions/postCount';
import {REMOVE_FROM_POST_SUCCESS} from '../actions/posts';

const initialState = {};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case REMOVE_FROM_POST_SUCCESS:
      return {
        ...state,
        [payload.user_id]: state[payload.user_id]
          ? --state[payload.user_id]
          : 0,
      };
    // case ADD_POST_TO_SUCCESS:
    //   if (
    //     [
    //       '',
    //       'system_header_change',
    //       'system_purpose_change',
    //       'system_displayname_change',
    //     ].includes(payload.type)
    //   ) {
    //     return {
    //       ...state,
    //       [payload.user_id]: state[payload.user_id]
    //         ? ++state[payload.user_id]
    //         : 1,
    //     };
    //   }
    // return state;
    case GET_POST_COUNT_SUCCESS:
      return {...state, [payload.userId]: payload.data};
    default:
      return state;
  }
};
