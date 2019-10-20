import filterPostBy from './filterPostBy';
import isChannelCreatorAdmin from './isChannelCreatorAdmin'
import cloneDeep from 'lodash/cloneDeep';

const getAdvancedSearchList = (state) => {
  const {
    users
  } = state;
  const {
    order,
    posts
  } = state.advancedSearch;
  const {
    myChannelsMap
  } = state;
  return {
    posts: order.map(key => {
      const post = cloneDeep(posts[key] || {});
      post.user = cloneDeep(users.data[post.user_id]);
      post.channel = myChannelsMap.has(post.channel_id) ?  myChannelsMap.get(post.channel_id) : {};
      return {
        ...post,
        isDollar: isChannelCreatorAdmin(state, post.channel_id)
      };
    }).filter(post => filterPostBy(post) && post.channel)
  };
};

export default getAdvancedSearchList;
