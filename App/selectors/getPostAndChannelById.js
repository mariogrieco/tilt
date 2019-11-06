// import _ from 'lodash';
import filterPostBy from './filterPostBy';
import getAllRootsforPost from './getAllRootsforPost';
import cloneDeep from 'lodash/cloneDeep';

export default (state, activeLabels) => {
  const blockedUsers = state.blockedUsers;
  const me = state.login.user ? state.login.user.id : null;
  const {entities} = state.posts;
  const {active_channel_id} = state.appNavigation;
  const lastViewAt = state.lastViewed[active_channel_id];
  let posts = [];
  let flagActive = false;
  let flagCount = 0;

  const store = state.posts.orders[active_channel_id];
  if (!!active_channel_id && store && store.order) {
    for (let index = store.order.length - 1; index >= 0; index -= 1) {
      const key = store.order[index];
      const post = cloneDeep(entities[key] || {});
      const data = {
        ...cloneDeep(post),
        user: state.users.data[post.user_id] || {},
        replies: getAllRootsforPost(store.order, entities, post.id),
      };

      if (filterPostBy(data) && !blockedUsers[data.user_id]) {
        if (!activeLabels) {
          return posts.unshift(data);
        } else {
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
  }

  const mapedProps = {
    channel: state.mapChannels.get(active_channel_id) || {},
    posts,
    flagCount,
  };
  mapedProps.channel.user =
    state.users.data[mapedProps.channel.creator_id] || {};
  return mapedProps;
};
