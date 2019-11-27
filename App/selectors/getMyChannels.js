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

const getMyChannels = createSelector(
  [myChannelsMapSelector, preferencesSelector],
  (myChannels, favChannels) => {
    const channels = [];
    myChannels.forEach(element => {
      channels.push({
        ...element,
        fav: favChannels[element.id],
      });
    });
    return channels.sort((a, b) => a.create_at - b.create_at);
  },
);

export default getMyChannels;
