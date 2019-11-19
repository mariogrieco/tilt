export const getReportIfNeeded = (state, postId) => {
  const post = state.posts.entities[postId];
  let reported = null;
  if (post && post.props) {
    if (post.props.reported) {
      reported = state.posts.entities[post.props.reported];
    }
  }
  if (reported) {
    reported.user = state.users.data[reported.user_id]
      ? state.users.data[reported.user_id]
      : {};
  }
  return reported;
};
