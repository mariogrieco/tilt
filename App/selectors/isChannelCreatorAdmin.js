const memo = {};

export default (state, channel_id) => {
  let channel = null;
  if (memo[channel_id]) {
    channel = memo[channel_id];
  }
 else {
  channel = [...state.channels, ...state.myChannels].find(channel => channel.id === channel_id);
  memo[channel_id] = channel;
 }

  if (channel) {
    if (!channel.creator_id) return false; // default channel and other does not . 
    const user = state.users.data[channel.creator_id];
    if (!user) return false;
    if (user && user.roles.includes('system_admin')) return true;
  };
  return false;
}
