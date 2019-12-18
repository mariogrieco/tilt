import filterPostBy from './filterPostBy';
import cloneDeep from 'lodash/cloneDeep';

const getAdvancedSearchList = state => {
  const {users, blockedUsers} = state;
  const {order, posts} = state.advancedSearch;
  const {mapChannels} = state;
  const whoIam = state.login.user ? state.login.user.id : null;
  return {
    posts: order
      .map(key => {
        const post = cloneDeep(posts[key] || {});
        post.user = cloneDeep(users.data[post.user_id]);
        post.channel = mapChannels.has(post.channel_id)
          ? mapChannels.get(post.channel_id)
          : {};
        post.pm = post.channel.type === 'D';
        if (post.pm) {
          const user =
            users.data[
              post.channel.name.replace(whoIam, '').replace('__', '')
            ] || {};
          post.channel.show_name = user.username;
        } else {
          post.channel.show_name = post.channel.name;
        }
        return {
          ...post,
          isDollar: post.channel.content_type !== 'N',
        };
      })
      .filter(
        post =>
          filterPostBy(post) && post.channel && !blockedUsers[post.user_ids],
      ),
  };
};

export default getAdvancedSearchList;
