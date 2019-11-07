import getAllRootsforPost from './getAllRootsforPost';

const getThreadForPost = (state, postData) => {
  if (!postData) return [];
  const entities = state.posts.entities;
  const postThreads = [];
  const parent_id = postData.parent_id;
  const rootId = postData.id;
  const channelData = state.posts.orders[postData.channel_id];
  let active = false;
  const data = [
    ...(channelData && channelData.order ? channelData.order : []),
  ].reverse();
  if (!channelData) return [];
  if (!parent_id || parent_id === '') {
    data.forEach(key => {
      if (key === rootId) {
        active = true;
        postThreads.push(entities[key]);
      } else if (active && entities[key]) {
        if (entities[key].parent_id === rootId) {
          postThreads.push(entities[key]);
        }
      }
    });
    // return postThreads;
  } else {
    data.forEach(key => {
      if (key === parent_id) {
        active = true;
        postThreads.push(entities[key]);
      } else if (active && entities[key]) {
        if (entities[key].parent_id === parent_id) {
          postThreads.push(entities[key]);
        }
      }
    });
  }
  return postThreads.map((post, index) => {
    let replies = 0;
    if (index === 0) {
      replies = getAllRootsforPost(
        channelData && channelData.order ? channelData.order : [],
        entities,
        post.id,
      );
    }
    return {
      ...post,
      replies,
      user: (post && state.users.data[post.user_id]) || {},
    };
  });
};

export default getThreadForPost;
