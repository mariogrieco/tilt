// import _ from 'lodash';
import {
  getFavoriteChannelById
} from './getFavoriteChannels';
import filterPostBy from './filterPostBy';
import getChannelNameForPM from './getChannelNameForPM';

import cloneDeep from 'lodash/cloneDeep';

const getPrivateMessagesChnnelsList = (state) => {
  const {
    entities
  } = state.posts;
  const myId = state.login && state.login.user ? state.login.user.id : '';
  const data = [];
  state.myChannelsMap.filter(({ type }) => (type === 'D')).valueSeq().forEach(channel => {
    const channelData = cloneDeep(state.posts.orders[channel.id]);
    if (channelData && channelData.order) {
      if (channel.type === 'D') {
        channel.display_name = getChannelNameForPM(state, channel);
      };
      data.push({
        ...channel,
        posts: [...channelData.order].map((key) => {
          const post = entities[key] || {}
          return {
            ...post,
            user: state.users.data[post.user_id] || {},
          };
        }).filter(post => filterPostBy(post)),
        creator: {},
        fav: getFavoriteChannelById(state, channel.id),
        activeUsers: channel.name.split('__'),
      });
    } else {
      data.push({
        posts: [],
        ...channel,
        activeUsers: [],
        fav: false,
        creator: {}
      });
    }
  });
  return data;
}

export default getPrivateMessagesChnnelsList;
