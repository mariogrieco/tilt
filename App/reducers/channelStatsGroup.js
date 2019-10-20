import {
  GET_CHANNELS_STATS_BY_GROUP_SUCCESS,
  GET_CHANNELS_STATS_BY_GROUP_ERROR
} from '../actions/channels';

const initialState = [];

const channelStatsGroup = (state = initialState, action) => {
  const dictionary = {};
  switch (action.type) {
    case GET_CHANNELS_STATS_BY_GROUP_SUCCESS:
      action.payload.forEach((stat) => {
        dictionary[stat.channel_id] = stat.member_count;
      });
      return dictionary;
    case GET_CHANNELS_STATS_BY_GROUP_ERROR:
      return action.payload;
    default:
      return state;
  }
};

export default channelStatsGroup;
