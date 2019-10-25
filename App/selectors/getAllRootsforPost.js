function getAllRootsforPost(postsOrder, posts, key) {
  if (!postsOrder || !posts || !key) return 0;
  let count = 0;
  postsOrder.forEach(id => {
    if (
      posts[id].id !== key &&
      (posts[id].root_id === key || posts[id].parent_id === key)
    ) {
      count++;
    }
  });
  return count;
}

export default getAllRootsforPost;
export const getAllRootsByChannelId = (post, channelId, state) => {
  const data = state.posts.orders[channelId];
  return getAllRootsforPost(data.order, state.posts.entities, post.id);
};
