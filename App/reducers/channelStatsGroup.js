import {
  GET_CHANNELS_STATS_BY_GROUP_SUCCESS,
  // GET_CHANNELS_STATS_BY_GROUP_ERROR,
} from '../actions/channels';
import cloneDeep from 'lodash/cloneDeep';

const initialState = {};

const channelStatsGroup = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHANNELS_STATS_BY_GROUP_SUCCESS:
      const nextState = cloneDeep(state);
      action.payload.forEach(stat => {
        nextState[stat.channel_id] = stat.member_count;
      });
      return nextState;
    // case GET_CHANNELS_STATS_BY_GROUP_ERROR:
    // return action.payload;
    default:
      return state;
  }
};

export default channelStatsGroup;
