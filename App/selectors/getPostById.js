import cloneDeep from 'lodash/cloneDeep';

const getPostById = (state, postId) => {
  const post = state.posts.entities[postId] || state.feeds.posts[postId];
  if (!post) {
    return {};
  }
  return {
    ...post,
    user: cloneDeep(state.users.data[post.user_id]) || {},
  };
};

export default getPostById;
