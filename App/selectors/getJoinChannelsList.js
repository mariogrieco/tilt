// import _ from 'lodash';
import {
  getFavoriteChannelById
} from './getFavoriteChannels';
import filterPostBy from './filterPostBy';
import isChannelCreatorAdmin from './isChannelCreatorAdmin';

const getChnnelsList = (state) => {
  const {
    entities
  } = state.posts;
  const myChannelsKeys = {};
  state.myChannels.forEach((channel) => {
    myChannelsKeys[channel.id] = channel;
  });
  const data = state.channels.filter(({ type, id }) => type === 'O' && !myChannelsKeys[id] && !isChannelCreatorAdmin(state, id)).map((channel) => {
    const channelData = state.posts.orders[channel.id];
    if (channelData && channelData.order) {
      return {
        ...channel,
        posts: channelData.order.map((key) => {
          return entities[key];
        }).reverse().filter(post => filterPostBy(post)).slice(0, 2),
        creator: state.users.data[channel.creator_id] || {},
        fav: getFavoriteChannelById(state, channel.id),
        activeUsers: {},
      };
    }
    return {
      posts: [],
      ...channel,
      activeUsers: {},
      fav: false,
      creator: {}
    };
  });
  return data;
}

export default getChnnelsList;
