import {
  GET_CHANNELS_STATS_SUCCESS,
  //   GET_CHANNELS_STATS_ERROR
} from '../actions/channels';

const initialState = {};

const channelsStat = (state = initialState, action) => {
  const newStats = {...state};
  switch (action.type) {
    case GET_CHANNELS_STATS_SUCCESS:
      newStats[action.payload.channel_id] = action.payload.member_count;
      return newStats;
    default:
      return state;
  }
};

export default channelsStat;
