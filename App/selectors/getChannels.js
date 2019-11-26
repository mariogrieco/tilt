const getChannels = (state, orderProp) => {
  const {myChannelsMap, mapChannels} = state;
  const channels = [];
  mapChannels.forEach(channel => {
    if (orderProp && channel[orderProp[0]] === orderProp[1]) {
      channels.push({
        ...channel,
        join: !myChannelsMap.get(channel.id),
      });
    }
  });
  return channels;
};

export default getChannels;
