import cloneDeep from 'lodash/cloneDeep';
import concat from 'lodash/concat';
import keys from 'lodash/keys';
import {
  GET_POST_SUCESS,
  GET_POST_FOR_CHANNEL_SUCCESS,
  ADD_POST_TO_SUCCESS,
  REMOVE_FROM_POST_SUCCESS,
  EDIT_POST_SUCCESS,
  REMOVE_POST_REDUCER_BY_CHANNEL_ID,
} from '../actions/posts';
import {REMOVE_FROM_CHANNEL_SUCESS} from '../actions/channels';
import {LOGOUT_SUCESS} from '../actions/login';
// import initialState from '../config/initialState/posts';
import uniq from 'lodash/uniq';

const initialState = {
  keys: [],
  entities: {
    post_id: {},
  },
  orders: {
    channel_id: {
      stop: false,
      page: 1,
      page_order: [[], []], // page as index to calculate order array
      order: [],
    },
  },
};

const posts = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_POST_REDUCER_BY_CHANNEL_ID:
    case REMOVE_FROM_CHANNEL_SUCESS: {
      const channel_id = action.payload;
      const nextState = cloneDeep(state);
      delete nextState.orders[channel_id];
      const nextEntities = {};
      const nextKeys = Object.keys(nextState.entities).filter(key => {
        return nextState.entities[key].channel_id !== channel_id;
      });
      nextKeys.forEach(key => {
        nextEntities[key] = nextState.entities[key];
      });

      nextState.keys = nextKeys;
      nextState.entities = nextEntities;

      nextState.orders[channel_id] = undefined;
      return nextState;
    }
    case LOGOUT_SUCESS: {
      return {
        keys: [],
        entities: {
          post_id: {},
        },
        orders: {
          channel_id: {
            stop: false,
            page: 1,
            page_order: [[], []],
            order: [],
          },
        },
      };
    }
    // case CREATE_POST_SUCCESS:
    case ADD_POST_TO_SUCCESS: {
      if (
        !state.orders[action.payload.channel_id] &&
        !state.entities[action.payload.id]
      )
        return state;
      const nextState = cloneDeep(state);
      nextState.orders[action.payload.channel_id].page_order[0].unshift(
        action.payload.id,
      );
      nextState.orders[action.payload.channel_id].order.unshift(
        action.payload.id,
      );
      nextState.entities[action.payload.id] = action.payload;
      nextState.keys = keys(nextState.entities);
      return nextState;
    }
    case EDIT_POST_SUCCESS: {
      const {id} = action.payload;
      const nextState = cloneDeep(state);
      nextState.entities[id] = action.payload;
      return nextState;
    }
    case REMOVE_FROM_POST_SUCCESS: {
      const nextState = cloneDeep(state);
      const postId = action.payload.id;
      const {channel_id} = action.payload;
      if (nextState.orders[channel_id]) {
        nextState.orders[channel_id].order = nextState.orders[
          channel_id
        ].order.filter(key => key !== postId);
        nextState.orders[channel_id].page_order = nextState.orders[
          channel_id
        ].page_order.map(orders => orders.filter(i => i !== postId));
      }
      delete nextState.entities[postId];
      nextState.keys = keys(nextState.entities);

      return nextState;
    }
    case GET_POST_FOR_CHANNEL_SUCCESS:
    case GET_POST_SUCESS: {
      const nextState = cloneDeep(state);
      action.payload.forEach(elm => {
        if (nextState.orders[elm.channel_id]) {
          const prev = cloneDeep(nextState.orders[elm.channel_id]);
          const nextPageOrder = prev.page_order;
          const nextPage = elm.page;
          nextPageOrder[elm.page] = elm.order;

          let nextOrder = [];
          nextPageOrder.forEach(orders => {
            nextOrder = concat(nextOrder, uniq(orders));
          });

          elm.order.forEach(key => {
            nextState.entities[key] = cloneDeep(elm.posts[key]);
          });

          nextState.orders[elm.channel_id] = {
            page: nextPage,
            page_order: nextPageOrder,
            order: nextOrder,
            stop: elm.order.length === 0,
          };

          nextState.keys = keys(nextState.entities);
        } else {
          nextState.orders[elm.channel_id] = {
            page: 0,
            page_order: [elm.order],
            order: elm.order,
          };
          elm.order.forEach(key => {
            nextState.entities[key] = elm.posts[key];
          });
          nextState.keys = keys(nextState.entities);
        }
      });
      return nextState;
    }
    default:
      return state;
  }
};

export default posts;
