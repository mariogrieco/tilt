import {createSelector} from 'reselect';

const usersDataSelector = state => state.users.data;
const flaggedOrderSelector = state => state.flagged.order;
const flaggedPostsSelector = state => state.flagged.posts;
const myChannelsMapSelector = state => state.myChannelsMap;

const getFlagged = createSelector(
  [
    usersDataSelector,
    flaggedOrderSelector,
    flaggedPostsSelector,
    myChannelsMapSelector,
  ],
  (usersData, flaggedOrder, flaggedPosts, myChannelsMap) => {
    const flagged_channels = [];

    myChannelsMap.valueSeq().forEach(channel => {
      const data = {
        ...channel,
        creator: usersData[channel.creator_id] || {},
        flagged: flaggedOrder
          .map(key => {
            const posts = flaggedPosts[key];
            if (posts.channel_id === channel.id) {
              const user = usersData[posts.user_id] || {};
              return {
                ...posts,
                user: {...user},
              };
            }
            return null;
          })
          .filter(item => item),
      };
      if (data.flagged.length > 0) {
        flagged_channels.push(data);
      }
    });

    return {
      flagged_channels,
    };
  },
);

export default getFlagged;
