import {createSelector} from 'reselect';

const myChannelsMapSelector = ({myChannelsMap, mapChannels}, filterMethod) => {
  const allChannels = filterMethod
    ? mapChannels.filter(filterMethod)
    : mapChannels;
  return allChannels.filter(channel => myChannelsMap.get(channel.id));
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
  (myChannels, favChannels, channelStatsGroup) => {
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
