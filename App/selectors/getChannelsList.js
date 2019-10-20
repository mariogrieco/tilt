import _ from 'lodash';
import {
  getFavoriteChannelById
} from './getFavoriteChannels';
import filterPostBy from './filterPostBy';

const getChnnelsList = (state) => {
  let channels = [];
  const {
    lastViewed
  } = state;
  const {
    entities
  } = state.posts;

  state.myChannelsMap.filter(c => c.type === 'O').valueSeq().forEach(channel => {
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
      });

      channels.push({
        ...channel,
        posts,
        creator: state.users.data[channel.creator_id]||{},
        fav: getFavoriteChannelById(state, channel.id),
        activeUsers: {},
        titleColor
      });
    } else {
      channels.push({
        posts: [],
        ...channel,
        activeUsers: {},
        fav: false,
        creator: {}
      });
    }
  })

  return channels;
}

export default getChnnelsList;
