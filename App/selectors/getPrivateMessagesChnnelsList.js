// import _ from 'lodash';
import {createSelector} from 'reselect';
import filterPostBy from './filterPostBy';

import cloneDeep from 'lodash/cloneDeep';

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
  ],
  (entities, myId, myChannelsMap, orders, usersData, preferences) => {
    const data = [];
    myChannelsMap
      .filter(({type}) => type === 'D')
      .valueSeq()
      .forEach(channel => {
        const channelData = cloneDeep(orders[channel.id]);
        if (channelData && channelData.order) {
          if (channel.type === 'D') {
            const userId = channel.name
              .replace(`${myId}`, '')
              .replace('__', '');
            channel.name = usersData[userId]
              ? usersData[userId].username
              : '';
          }
          data.push({
            ...channel,
            posts: [...channelData.order]
              .map(key => {
                const post = entities[key] || {};
                return {
                  ...post,
                  user: usersData[post.user_id] || {},
                };
              })
              .filter(post => filterPostBy(post)),
            creator: {},
            fav: preferences.find(fav => fav.name === channel.id),
            activeUsers: channel.name.split('__'),
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
