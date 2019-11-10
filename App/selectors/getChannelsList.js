import orderBy from 'lodash/orderBy';
import {createSelector} from 'reselect';
import filterPostBy from './filterPostBy';

const lastViewedSelector = state => state.lastViewed;
const entitiesSelector = state => state.posts.entities;
const myChannelsMapSelector = state => state.myChannelsMap;
const ordersSelector = state => state.posts.orders;
const usersDataSelector = state => state.users.data;
const preferencesSelector = state =>
  state.preferences.filter(pre => pre.category === 'favorite_channel');

const getChnnelsList = createSelector(
  [
    lastViewedSelector,
    entitiesSelector,
    myChannelsMapSelector,
    ordersSelector,
    usersDataSelector,
    preferencesSelector,
  ],
  (lastViewed, entities, myChannelsMap, orders, data, preferences) => {
    let channels = [];

    myChannelsMap
      .filter(c => c.type === 'O')
      .valueSeq()
      .forEach(channel => {
        const channelData = orders[channel.id];
        if (channelData && channelData.order) {
          let titleColor = '';
          let unreadMessagesCount = 0;
          const posts = channelData.order.map(key => {
            if (!!lastViewed[channel.id] && filterPostBy(entities[key])) {
              if (
                entities[key] &&
                (entities[key].create_at > lastViewed[channel.id] ||
                  entities[key].edit_at > lastViewed[channel.id])
              ) {
                titleColor = '#17C491';
                unreadMessagesCount++;
              }
            }
            return entities[key];
          });

          channels.push({
            ...channel,
            posts,
            creator: data[channel.creator_id] || {},
            fav: preferences.find(fav => fav.name === channel.id),
            activeUsers: {},
            titleColor,
            unreadMessagesCount,
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

    return orderBy(channels, ['fav', 'name'], ['asc']);
  },
);

export default getChnnelsList;
