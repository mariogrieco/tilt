import _ from 'lodash';
import {
  getFavoriteChannelById
} from './getFavoriteChannels';
import filterPostBy from './filterPostBy';

const getChnnelsList = (state) => {
  const {
    lastViewed
  } = state;
  const {
    entities
  } = state.posts;
  const data = state.myChannels.filter(({ type }) => type === 'O').map((channel) => {
    const channelData = state.posts.orders[channel.id];
    if (channelData && channelData.order) {
          let titleColor = '#0E141E';
          const posts = channelData.order.map((key) => {
            if (!!lastViewed[channel.id] && filterPostBy(entities[key])) {
              if (entities[key] && (entities[key].create_at > lastViewed[channel.id] || entities[key].edit_at > lastViewed[channel.id])) {
                titleColor = '#17C491';
          };
        };
        return entities[key];
      }); //.reverse().filter(post => filterPostBy(post)).slice(0, 2);
      return {
        ...channel,
        posts,
        creator: state.users.data[channel.creator_id]||{},
        fav: getFavoriteChannelById(state, channel.id),
        activeUsers: {},
        titleColor
      };
    };
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
