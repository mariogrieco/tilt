// import _ from 'lodash';
import {getFavoriteChannelById} from './getFavoriteChannels';
import filterPostBy from './filterPostBy';

const getChnnelsList = state => {
  const {entities} = state.posts;
  const {myChannelsMap, mapChannels} = state;
  const data = [];

  mapChannels
    .filter(({type, id}) => type === 'O' && !myChannelsMap.has(id))
    .valueSeq()
    .forEach(channel => {
      const channelData = state.posts.orders[channel.id];
      if (channelData && channelData.order) {
        data.push({
          ...channel,
          posts: channelData.order
            .map(key => {
              return entities[key];
            })
            .reverse()
            .filter(post => filterPostBy(post))
            .slice(0, 2),
          creator: state.users.data[channel.creator_id] || {},
          fav: getFavoriteChannelById(state, channel.id),
          activeUsers: {},
        });
      } else {
        data.push({
          posts: [],
          ...channel,
          activeUsers: {},
          fav: false,
          creator: {},
        });
      }
    });
  return data;
};

export default getChnnelsList;
