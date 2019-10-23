export default (state, channel_id) => {
  let channel = null;

  if (state.mapChannels.has(channel_id)) {
    channel = state.mapChannels.get(channel_id);
  }

  if (state.myChannelsMap.has(channel_id)) {
    channel = state.myChannelsMap.get(channel_id);
  }

  if (channel) {
    const creator = channel.creator_id;
    if (!creator) return false; // default channel and other does not .
    const user = state.users.data[creator];
    if (!user) return false;
    if (user && user.roles.includes('system_admin')) return true;
  }
  return false;
};

export const isChannelCreatorAdmin = (
  mapChannels,
  myChannelsMap,
  users,
  channel_id,
) => {
  let channel = null;

  if (mapChannels.has(channel_id)) {
    channel = mapChannels.get(channel_id);
  }

  if (myChannelsMap.has(channel_id)) {
    channel = myChannelsMap.get(channel_id);
  }

  if (channel) {
    const creator = channel.creator_id;
    if (!creator) return false; // default channel and other does not .
    const user = users.data[creator];
    if (!user) return false;
    if (user && user.roles.includes('system_admin')) return true;
  }
  return false;
};
