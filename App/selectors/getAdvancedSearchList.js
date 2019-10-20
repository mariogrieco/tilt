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
    myChannels
  } = state;
  return {
    posts: order.map(key => {
      const post = cloneDeep(posts[key] || {});
      post.user = cloneDeep(users.data[post.user_id]);
      post.channel = cloneDeep(myChannels.find(channel => channel.id === post.channel_id));
      return {
        ...post,
        isDollar: isChannelCreatorAdmin(state, post.channel_id)
      };
    }).filter(post => filterPostBy(post) && post.channel)
  };
};

export default getAdvancedSearchList;