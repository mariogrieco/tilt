// import _ from 'lodash';
import {createSelector} from 'reselect';
import filterPostBy from './filterPostBy';

import cloneDeep from 'lodash/cloneDeep';

const lastViewedSelector = state => state.lastViewed;
const entitiesSelector = state => state.posts.entities;
const loggedUserId = state =>
  state.login && state.login.user ? state.login.user.id : '';
const myChannelsMapSelector = state => state.myChannelsMap;
const postsOrders = state => state.posts.orders;
const usersDataSelector = state => state.users.data;
const preferencesSelector = state =>
  state.preferences.filter(pre => pre.category === 'favorite_channel');

const getPrivateMessagesChnnelsList = createSelector(
  [
    entitiesSelector,
    loggedUserId,
    myChannelsMapSelector,
    postsOrders,
    usersDataSelector,
    preferencesSelector,
    lastViewedSelector,
  ],
  (
    entities,
    myId,
    myChannelsMap,
    orders,
    usersData,
    preferences,
    lastViewed,
  ) => {
    const data = [];
    myChannelsMap
      .filter(({type}) => type === 'D')
      .valueSeq()
      .forEach(channel => {
        const channelData = cloneDeep(orders[channel.id]);
        if (channelData && channelData.order) {
          if (channel.type === 'D' && channel.name.match('__')) {
            const userId = channel.name
              .replace(`${myId}`, '')
              .replace('__', '');
            channel.show_name = usersData[userId]
              ? usersData[userId].username
              : '';
          }
          let titleColor = '';
          let unreadMessagesCount = 0;
          const posts = channelData.order.map(key => {
            if (filterPostBy(entities[key])) {
              if (
                entities[key] &&
                (entities[key].create_at > lastViewed[channel.id] ||
                  entities[key].edit_at > lastViewed[channel.id])
              ) {
                titleColor = '#17C491';
                unreadMessagesCount++;
              }
            }
            const post = entities[key] || {};
            return {
              ...post,
              user: usersData[post.user_id] || {},
            };
          });
          data.push({
            ...channel,
            posts: posts,
            creator: {},
            fav: preferences.find(fav => fav.name === channel.id),
            activeUsers: channel.name.split('__'),
            titleColor,
            unreadMessagesCount,
          });
        } else {
          data.push({
            posts: [],
            ...channel,
            activeUsers: [],
            fav: false,
            creator: {},
          });
        }
      });
    return data;
  },
);

export default getPrivateMessagesChnnelsList;
