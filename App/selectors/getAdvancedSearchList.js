import filterPostBy from './filterPostBy';
import isChannelCreatorAdmin from './isChannelCreatorAdmin';
import cloneDeep from 'lodash/cloneDeep';

const getAdvancedSearchList = state => {
  const {users, blockedUsers} = state;
  const {order, posts} = state.advancedSearch;
  const {myChannelsMap} = state;
  const whoIam = state.login.user ? state.login.user.id : null;
  return {
    posts: order
      .map(key => {
        const post = cloneDeep(posts[key] || {});
        post.user = cloneDeep(users.data[post.user_id]);
        post.channel = myChannelsMap.has(post.channel_id)
          ? myChannelsMap.get(post.channel_id)
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
        post.channel.isDollar = isChannelCreatorAdmin(state, post.channel_id);
        return {
          ...post,
          isDollar: post.channel.isDollar,
        };
      })
      .filter(
        post =>
          filterPostBy(post) && post.channel && !blockedUsers[post.user_ids],
      ),
  };
};

export default getAdvancedSearchList;
