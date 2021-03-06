import {createSelector} from 'reselect';
import filterPostBy from './filterPostBy';

const postsSelector = state => state.posts;

const privateChannelsSelector = state =>
  state.myChannelsMap
    .keySeq()
    .map(id => state.mapChannels.get(id))
    .filter(channel => {
      if (channel) {
        const {type, name} = channel;
        return (
          type === 'D' &&
          !state.blockedUsers[
            name
              .replace('__', '')
              .replace(`${state.login.user ? state.login.user.id : ''}`, '')
          ]
        );
      }
    });

const publicChannelsSelector = state =>
  state.myChannelsMap
    .keySeq()
    .filter(
      key =>
        state.mapChannels.has(key) &&
        state.mapChannels.get(key).type === 'O' &&
        state.mapChannels.get(key).content_type === 'N',
    )
    .map(key => state.mapChannels.get(key));

const lastViewedSelector = state => state.lastViewed;

const looper = (posts, channels, lastViewed) => {
  let hasUnreadMessage = false;
  channels.valueSeq().forEach(channel => {
    const channelData = posts.orders[channel.id];
    if (channelData) {
      channelData.order.some(postKey => {
        const post = posts.entities[postKey];
        if (filterPostBy(post) && post.create_at > lastViewed[channel.id]) {
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
