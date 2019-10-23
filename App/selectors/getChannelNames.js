import {createSelector} from 'reselect';
import getKeys from 'lodash/keys';
import {isChannelCreatorAdmin} from './isChannelCreatorAdmin';

const channelNamesSelector = state => state.channelsNames;
const mapChannelsSelector = state => state.mapChannels;
const myChannelsMapSelector = state => state.myChannelsMap;
const usersSelector = state => state.users;

export const getHashTagChannelsNames = createSelector(
  [
    channelNamesSelector,
    mapChannelsSelector,
    myChannelsMapSelector,
    usersSelector,
  ],
  (channelsNames, mapChannels, myChannelsMap, users) => {
    console.log('llamado calculo de hashtags en PureParser');
    const keys = getKeys(channelsNames);
    const allData = keys
      .filter(key => {
        const isAdmin = isChannelCreatorAdmin(
          mapChannels,
          myChannelsMap,
          users,
          channelsNames[key].id,
        );
        return (
          !isAdmin &&
          channelsNames[key].type === 'O' &&
          !!channelsNames[key].format_name
        );
      })
      .map(key => channelsNames[key].format_name);
    return allData.sort((a, b) => b.length - a.length);
  },
);

export const getDollarChannelNames = createSelector(
  [
    channelNamesSelector,
    mapChannelsSelector,
    myChannelsMapSelector,
    usersSelector,
  ],
  (channelsNames, mapChannels, myChannelsMap, users) => {
    console.log('llamado calculo de dollars en PureParser');
    const keys = getKeys(channelsNames);
    const allData = keys
      .filter(key => {
        const isAdmin = isChannelCreatorAdmin(
          mapChannels,
          myChannelsMap,
          users,
          channelsNames[key].id,
        );
        return (
          isAdmin &&
          channelsNames[key].type === 'O' &&
          !!channelsNames[key].format_name
        );
      })
      .map(key => channelsNames[key].format_name);
    return allData.sort((a, b) => b.length - a.length);
  },
);

export const getChannelDisplayNameAsDictionary = createSelector(
  [
    channelNamesSelector,
    mapChannelsSelector,
    myChannelsMapSelector,
    usersSelector,
  ],
  (channelsNames, mapChannels, myChannelsMap, users) => {
    const dollarChannels = {};
    const hashtagChannels = {};
    const keys = getKeys(channelsNames);
    keys
      .filter(key => {
        const isAdmin = isChannelCreatorAdmin(
          mapChannels,
          myChannelsMap,
          users,
          channelsNames[key].id,
        );
        return (
          channelsNames[key].type === 'O' &&
          isAdmin &&
          !!channelsNames[key].format_name
        );
      })
      .forEach(key => {
        dollarChannels[key] = channelsNames[key].format_name;
      });

    keys
      .filter(key => {
        const isAdmin = isChannelCreatorAdmin(
          mapChannels,
          myChannelsMap,
          users,
          channelsNames[key].id,
        );
        return (
          channelsNames[key].type === 'O' &&
          !isAdmin &&
          !!channelsNames[key].format_name
        );
      })
      .forEach(key => {
        hashtagChannels[key] = channelsNames[key].format_name;
      });
    return {
      hashtagChannels,
      dollarChannels,
    };
  },
);
