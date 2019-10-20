export const getFavoriteChannels = state => {
  const {preferences} = state;
  return [...preferences].filter(pre => pre.category === 'favorite_channel');
};

export const getFavoriteChannelById = (state, channel_id) => {
  const favorites = getFavoriteChannels(state);
  return favorites.find(fav => fav.name === channel_id);
};
