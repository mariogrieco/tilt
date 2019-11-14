import {createSelector} from 'reselect';

const postsSelector = state => state.posts;
const privateChannelsSelector = state =>
  state.myChannelsMap.filter(({type}) => type === 'D');
const publicChannelsSelector = state =>
  state.myChannelsMap.filter(({type}) => type === 'O');
const lastViewedSelector = state => state.lastViewed;

const looper = (posts, channels, lastViewed) => {
  let hasUnreadMessage = false;
  channels.valueSeq().forEach(channel => {
    const channelData = posts.orders[channel.id];
    if (channelData) {
      channelData.order.some(postKey => {
        if (
          posts.entities[postKey].create_at > lastViewed[channel.id] ||
          posts.entities[postKey].edit_at > lastViewed[channel.id]
        ) {
          hasUnreadMessage = true;
        }
        return hasUnreadMessage;
      });
    }
  });
  return hasUnreadMessage;
};

export const notifyMessageIconForPrivateTab = createSelector(
  [postsSelector, privateChannelsSelector, lastViewedSelector],
  looper,
);

export const notifyMessageIconForPublicTab = createSelector(
  [postsSelector, publicChannelsSelector, lastViewedSelector],
  looper,
);
