export const getRepostById = state => {
  const repost = state.repost ? state.posts.entities[state.repost] : null;
  if (repost) {
    repost.user = state.users.data[repost.user_id]
      ? state.users.data[repost.user_id]
      : {};
  }
  return repost;
};
