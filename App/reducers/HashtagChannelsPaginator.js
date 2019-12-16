import {GET_PAGE_SUCCESS} from '../actions/HashtagChannelsPaginator'; 

const initialState = {
  page: 0,
  stop: false,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_PAGE_SUCCESS:
      return {
        ...state,
        page: payload.page,
        stop: payload.channels.length === 0,
      };
    default:
      return state;
  }
};
