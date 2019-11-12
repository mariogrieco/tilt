// import momemt from 'moment'
import some from 'lodash/some';
// import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import filterPostBy from './filterPostBy';
import getAllRootsforPost from './getAllRootsforPost';

const getUserById = (state, userId) => {
  const {users, myChannelsMap} = state;
  const channels = myChannelsMap
    .filter(c => c.type === 'O')
    .valueSeq()
    .map(channel => {
      const posts = state.posts.orders[channel.id];
      return {
        posts: getAllPost(posts, userId, state.posts.entities),
        ...channel,
      };
    });
  const userResult = users.data[userId] || {};
  return {
    user: {...userResult},
    channels: channels.filter(({posts}) => (posts ? posts.length > 0 : null)),
  };
};

function getAllPost(data, userId, entities) {
  if (!data || !data.order) return null;
  const result = [];
  data.order.forEach(key => {
    result.push(entities[key]);
  });
  result.reverse();
  return result
    .filter(({user_id}) => user_id === userId)
    .map(post => ({
      ...post,
      replies: getAllRootsforPost(data.order, entities, post.id),
      // user: state.users.find(user => user.id === posts.user_id)
    }))
    .filter(i => filterPostBy(i));
}

const filterIfPrivate = (state, channel_id) => {
  let channel = state.mapChannels.get(channel_id);
  channel = channel ? channel : state.myChannelsMap.get(channel_id);

  if (channel && channel.type !== 'O') {
    return true;
  }

  return false;
};

export const getAllPostByUserId = (state, userId) => {
  const posts = [];
  // let userPosts = [];
  const filterSymtemMessages = ['join', 'leave'];
  if (!userId) return [];
  state.posts.keys.forEach(key => {
    const post = state.posts.entities[key];
    if (
      post &&
      post.user_id === userId &&
      !some(filterSymtemMessages, el => includes(post.type, el))
    ) {
      posts.push(post);
    }
  });
  let sortPost = posts.sort((a, b) => b.create_at - a.create_at);
  sortPost = sortPost.filter(post => !filterIfPrivate(state, post.channel_id));
  // userPosts = sortBy(posts, ['createdAt']);
  return sortPost;
};

export default getUserById;
