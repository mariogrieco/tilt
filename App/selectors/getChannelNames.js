import {createSelector} from 'reselect';
import getKeys from 'lodash/keys';

const channelNamesSelector = state => state.channelsNames;
const mapChannelsSelector = state => state.mapChannels;
const myChannelsMapSelector = state => state.myChannelsMap;
const usersSelector = state => state.users;
const adminCreatorsSelector = state => state.adminCreators;

export const getHashTagChannelsNames = createSelector(
  [
    channelNamesSelector,
    mapChannelsSelector,
    myChannelsMapSelector,
    usersSelector,
    adminCreatorsSelector,
  ],
  (channelsNames, mapChannels, myChannelsMap, users, adminCreators) => {
    const keys = getKeys(channelsNames);
    const allData = keys
      .filter(key => {
        const isAdmin = channelsNames[key].content_type !== 'N';
        return (
          !isAdmin &&
          channelsNames[key].type === 'O' &&
          !!channelsNames[key].name
        );
      })
      .map(key => channelsNames[key].name);
    return allData.sort((a, b) => b.length - a.length);
  },
);

export const getDollarChannelNames = createSelector(
  [
    channelNamesSelector,
    mapChannelsSelector,
    myChannelsMapSelector,
    usersSelector,
    adminCreatorsSelector,
  ],
  (channelsNames, mapChannels, myChannelsMap, users, adminCreators) => {
    const keys = getKeys(channelsNames);
    const allData = keys
      .filter(key => {
        const isAdmin = channelsNames[key].content_type !== 'N'; 
        return (
          isAdmin &&
          channelsNames[key].type === 'O' &&
          !!channelsNames[key].name
        );
      })
      .map(key => channelsNames[key].name);
    return allData.sort((a, b) => b.length - a.length);
  },
);

export const getChannelDisplayNameAsDictionary = createSelector(
  [
    channelNamesSelector,
    mapChannelsSelector,
    myChannelsMapSelector,
    usersSelector,
    adminCreatorsSelector,
  ],
  (channelsNames, mapChannels, myChannelsMap, users, adminCreators) => {
    const dollarChannels = {};
    const hashtagChannels = {};
    const keys = getKeys(channelsNames);
    keys
      .filter(key => {
        const isAdmin = channelsNames[key].content_type !== 'N';
        return (
          channelsNames[key].type === 'O' &&
          isAdmin &&
          !!channelsNames[key].name
        );
      })
      .forEach(key => {
        dollarChannels[key] = channelsNames[key].name;
      });

    keys
      .filter(key => {
        const isAdmin = channelsNames[key].content_type !== 'N'; 
        return (
          channelsNames[key].type === 'O' &&
          !isAdmin &&
          !!channelsNames[key].name
        );
      })
      .forEach(key => {
        hashtagChannels[key] = channelsNames[key].name;
      });
    return {
      hashtagChannels,
      dollarChannels,
    };
  },
);
