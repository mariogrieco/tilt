import getKeys from 'lodash/keys';
import parser from '../utils/parse_display_name';
import isChannelCreatorAdmin from './isChannelCreatorAdmin';

export const getHashTagChannelsNames = state => {
  const keys = getKeys(state.channelsNames);
  const allData = keys
    .filter(key => {
      const isAdmin = isChannelCreatorAdmin(state, state.channelsNames[key].id);
      return (
        !isAdmin &&
        state.channelsNames[key].type === 'O' &&
        !!state.channelsNames[key].format_name
      );
    })
    .map(key => state.channelsNames[key].format_name);
  return allData.sort((a, b) => b.length - a.length);
};

export const getDolarChannelNames = state => {
  const keys = getKeys(state.channelsNames);
  const allData = keys
    .filter(key => {
      const isAdmin = isChannelCreatorAdmin(state, state.channelsNames[key].id);
      return (
        state.channelsNames[key].type === 'O' &&
        isAdmin &&
        !!state.channelsNames[key].format_name
      );
    })
    .map(key => state.channelsNames[key].format_name);
  return allData.sort((a, b) => b.length - a.length);
};

export const getMychannelsNames = state => {
  const names = state.myChannelsMap
    .filter(({type}) => type === 'O')
    .map(({display_name}) => parser(display_name))
    .valueSeq()
    .toJS();
  return names.sort((a, b) => b.length - a.length);
};

export const getChannelById = (state, channelId) => {
  const result = state.mapChannels.find(channel => channel.id === channelId);
  if (result) return result.display_name;
  return '';
};

export const getChannelDisplayNameAsDictionary = state => {
  const dollarChannels = {};
  const hashtagChannels = {};
  const keys = getKeys(state.channelsNames);
  keys
    .filter(key => {
      const isAdmin = isChannelCreatorAdmin(state, state.channelsNames[key].id);
      return (
        state.channelsNames[key].type === 'O' &&
        isAdmin &&
        !!state.channelsNames[key].format_name
      );
    })
    .forEach(key => {
      dollarChannels[key] = state.channelsNames[key].format_name;
    });

  keys
    .filter(key => {
      const isAdmin = isChannelCreatorAdmin(state, state.channelsNames[key].id);
      return (
        state.channelsNames[key].type === 'O' &&
        !isAdmin &&
        !!state.channelsNames[key].format_name
      );
    })
    .forEach(key => {
      hashtagChannels[key] = state.channelsNames[key].format_name;
    });

  return {
    dollarChannels,
    hashtagChannels,
  };
};
