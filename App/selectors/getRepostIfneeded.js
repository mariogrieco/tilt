export const getRepostIfneeded = (state, postId) => {
  const post = state.posts.entities[postId];
  let repost = null;
  if (post && post.props) {
    if (post.props.repost) {
      repost = state.posts.entities[post.props.repost];
    }
  }
  if (repost) {
    repost.user = state.users.data[repost.user_id]
      ? state.users.data[repost.user_id]
      : {};
  }
  return repost;
};
