export default getFlagged = (state) => {
  const flagged_channels = state.myChannels.map(channel => ({
    ...channel,
    creator: state.users.data[channel.creator_id] || {},
    flagged: state.flagged.order.map((key) => {
      const posts = state.flagged.posts[key];
      if (posts.channel_id === channel.id) {
        const user = state.users.data[posts.user_id] || {};
        return {
          ...posts,
          user:  { ...user }
        };
      }
      return null;
    }).filter(i => i)
  })).filter(channel => channel.flagged ? channel.flagged.length > 0 : null);
  return {
    flagged_channels
  };
};
