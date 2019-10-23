import {createSelector} from 'reselect';
import {getFavoriteChannelById} from './getFavoriteChannels';
import filterPostBy from './filterPostBy';

const lastViewedSelector = state => state.lastViewed;
const entitiesSelector = state => state.posts.entities;
const myChannelsMapSelector = state => state.myChannelsMap;
const ordersSelector = state => state.posts.orders;
const usersDataSelector = state => state.users.data;

const getChnnelsList = createSelector(
  [
    lastViewedSelector,
    entitiesSelector,
    myChannelsMapSelector,
    ordersSelector,
    usersDataSelector,
  ],
  (lastViewed, entities, myChannelsMap, orders, data) => {
    let channels = [];

    myChannelsMap
      .filter(c => c.type === 'O')
      .valueSeq()
      .forEach(channel => {
        const channelData = orders[channel.id];
        if (channelData && channelData.order) {
          let titleColor = '#0E141E';
          const posts = channelData.order.map(key => {
            if (!!lastViewed[channel.id] && filterPostBy(entities[key])) {
              if (
                entities[key] &&
                (entities[key].create_at > lastViewed[channel.id] ||
                  entities[key].edit_at > lastViewed[channel.id])
              ) {
                titleColor = '#17C491';
              }
            }
            return entities[key];
          });

          channels.push({
            ...channel,
            posts,
            creator: data[channel.creator_id] || {},
            fav: null,
            activeUsers: {},
            titleColor,
          });
        } else {
          channels.push({
            posts: [],
            ...channel,
            activeUsers: {},
            fav: false,
            creator: {},
          });
        }
      });

    return channels;
  },
);

export default getChnnelsList;
