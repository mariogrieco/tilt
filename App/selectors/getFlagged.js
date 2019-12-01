import {createSelector} from 'reselect';

const usersDataSelector = state => state.users.data;
const flaggedOrderSelector = state => state.flagged.order;
const flaggedPostsSelector = state => state.flagged.posts;
const myIdSelector = state => (state.login.user ? state.login.user.id : null);
const myChannelsMapSelector = state => state.myChannelsMap;
const mapChannelsSelector = state => state.mapChannels;
const usersSelector = state => state.users;
const adminCreatorsSelector = state => state.adminCreators;

const getFlagged = createSelector(
  [
    usersDataSelector,
    flaggedOrderSelector,
    flaggedPostsSelector,
    myIdSelector,
    mapChannelsSelector,
    myChannelsMapSelector,
    usersSelector,
    adminCreatorsSelector,
  ],
  (
    usersData,
    flaggedOrder,
    flaggedPosts,
    myId,
    mapChannels,
    myChannelsMap,
    users,
    adminCreators,
  ) => {
    const flagged_channels = [];

    myChannelsMap.keySeq().forEach(id => {
      const channel = mapChannels.get(id);
      if (!channel) return null;
      const data = {
        ...channel,
        creator: usersData[channel.creator_id] || {},
        flagged: flaggedOrder
          .map(key => {
            const posts = flaggedPosts[key];
            if (posts.channel_id === channel.id) {
              const user = usersData[posts.user_id] || {};
              const flagged_posts = {
                ...posts,
                user: {...user},
              };
              return flagged_posts;
            }
            return null;
          })
          .filter(item => item),
      };
      if (data.flagged.length > 0) {
        if (data.type === 'D') {
          const curretDisplayNameId = data.name
            .replace(myId, '')
            .replace('__', '');
          data.show_name = `${(usersData[curretDisplayNameId] || {}).username}`;
          data.prefix = '@';
        } else {
          data.show_name = data.name;
          data.prefix = data.content_type !== 'N' ? '$' : '#';
        }
        flagged_channels.push(data);
      }
    });

    return {
      flagged_channels,
    };
  },
);

export default getFlagged;
