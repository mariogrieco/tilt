import getPostAndChannelById from './getPostAndChannelById';
import filterPostBy from './filterPostBy';
// import getAllRootsforPost from './getAllRootsforPost';
import cloneDeep from 'lodash/cloneDeep';

const getJumpPosts = state => {
  const me = state.login.user ? state.login.user.id : null;
  const {jumpPosts} = state.advancedSearch;
  const {active_channel_id} = state.appNavigation;
  const lastViewAt = state.lastViewed[active_channel_id];
  let posts = [];
  let flagActive = false;
  let flagCount = 0;
  const order = jumpPosts.order;
  if (!!active_channel_id) {
    for (let index = order.length - 1; index >= 0; index -= 1) {
      const key = order[index];
      const post = jumpPosts.posts[key] || {};
      const data = {
        ...cloneDeep(post),
        user: state.users.data[post.user_id] || {},
        // replies: getAllRootsforPost(order, entities, post.id)
      };
      if (filterPostBy(data)) {
        // if (!activeLabels) return posts.unshift(data);
        if (
          me !== data.user_id &&
          lastViewAt !== undefined &&
          !flagActive &&
          (post.create_at > lastViewAt || post.edit_at > lastViewAt)
        ) {
          flagActive = true;
          data.render_separator = true;
        }
        if (flagActive) {
          flagCount += 1;
        }
        posts.unshift(data);
      }
    }
  }
  const channel = state.mapChannels.get(active_channel_id) || {};
  return {
    posts,
    flagCount,
    activeJumpLabel: true,
    channel: channel,
  };
};

export const getJumpPostsOrtList = state => {
  let data = {};
  const {activeJump} = state.advancedSearch;
  if (!activeJump) {
    data = getPostAndChannelById(state, true);
  } else {
    data = getJumpPosts(state);
  }
  return data;
};
