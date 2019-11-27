import {createSelector} from 'reselect';

const myChannelsMapSelector = state => state.myChannelsMap;
const channelsMapSelector = (state, filterMethod) => {
  if (filterMethod) {
    return state.mapChannels.filter(filterMethod);
  }
  return state.mapChannels;
};
const preferencesSelector = state =>
  state.preferences.filter(pre => pre.category === 'favorite_channel');

const getAllChannels = createSelector(
  [myChannelsMapSelector, channelsMapSelector, preferencesSelector],
  (myChannels, channels, favChannels) => {
    const results = [];
    channels
      .filter(({type}) => type !== 'D')
      .valueSeq()
      .forEach(element => {
        results.push({
          ...element,
          fav: favChannels.find(({name}) => name === element.id),
          join: !myChannels.get(element.id),
        });
      });
    return results;
  },
);

export default getAllChannels;
