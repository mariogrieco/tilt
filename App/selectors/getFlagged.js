export default getFlagged = (state) => {
  const flagged_channels = [];

  state.myChannelsMap.valueSeq().forEach((channel) => {
    const data = {
      ...channel,
      creator: state.users.data[channel.creator_id] || {},
      flagged: state.flagged.order.map((key) => {
        const posts = state.flagged.posts[key];
        if (posts.channel_id === channel.id) {
          const user = state.users.data[posts.user_id] || {};
          return {
            ...posts,
            user: { ...user }
          };
        }
        return null;
      }).filter(i => i)
    };
    if (data.flagged.length > 0) {
      flagged_channels.push(data);
    }
  });

  return {
    flagged_channels
  };
}
