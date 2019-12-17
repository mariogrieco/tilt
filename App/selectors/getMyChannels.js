import {createSelector} from 'reselect';
import filterPostBy from './filterPostBy';

const myChannelsMapSelector = ({
    myChannelsMap,
    mapChannels,
    posts,
    lastViewed,
  },
  filterMethod) => {
  const allChannels = filterMethod
    ? mapChannels.filter(filterMethod)
    : mapChannels;
  return allChannels
    .filter(channel => myChannelsMap.get(channel.id))
    .map(channel => {
      return {
        ...channel,
        unreadMessagesCount: countUnredMessages(
          posts.orders[channel.id] ? posts.orders[channel.id].order : [],
          posts.entities,
          lastViewed,
          channel.id,
        ),
      };
    });
};

const countUnredMessages = (
  order = [],
  entities = {},
  lastViewed = {},
  channel_id = null,
) => {
  const data = order
    .map(key => entities[key])
    .filter(post => {
      return (
        post && post.create_at > lastViewed[channel_id] && filterPostBy(post)
      );
    });
  return data.length;
};

const preferencesSelector = state => {
  const pref = {};
  state.preferences.forEach(pre => {
    if (pre.category === 'favorite_channel') {
      pref[pre.name] = true;
    } else {
      pref[pre.name] = false;
    }
  });
  return pref;
};

const channelStatsGroupSelector = state => {
  return state.channelStatsGroup;
};

const getMyChannels = createSelector(
  [myChannelsMapSelector, preferencesSelector, channelStatsGroupSelector],
  (myChannels, favChannels, channelStatsGroup, lastViewed, posts) => {
    const channels = [];
    myChannels.forEach(element => {
      channels.push({
        ...element,
        fav: favChannels[element.id],
        members: channelStatsGroup[element.id] || 0,
      });
    });
    return channels
      .sort((a, b) => a.create_at - b.create_at)
      .sort((a, b) => (a.fav && !b.fav ? -1 : 1));
  },
);

export default getMyChannels;
