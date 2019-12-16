import {createSelector} from 'reselect';

const channelPostIdSelector = (state, props) =>
  state.feeds.posts[props.id] ||
  state.posts.entities[props.id] ||
  state.followingTimeline.post_entities[props.id] ||
  {};
const myChannelsMapSelector = state => state.myChannelsMap;
const mapChannelsSelector = state => state.mapChannels;

const updateFeedJoin = () =>
  createSelector(
    [channelPostIdSelector, myChannelsMapSelector, mapChannelsSelector],
    (post, myChannelsMap, mapChannels) => {
      if (myChannelsMap.get(post.channel_id)) {
        return false;
      } else if (mapChannels.get(post.channel_id)) {
        return true;
      } else {
        //waiting sync, but the join is available anyway
        return true;
      }
    },
  );

export default updateFeedJoin;
