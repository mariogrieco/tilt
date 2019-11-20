import {createSelector} from 'reselect';

const channelPostIdSelector = (state, props) =>
  state.feeds.posts[props.id].channel_id;
const myChannelsMapSelector = state => state.myChannelsMap;
const mapChannelsSelector = state => state.mapChannels;

const updateFeedJoin = () =>
  createSelector(
    [channelPostIdSelector, myChannelsMapSelector, mapChannelsSelector],
    (channelPostId, myChannelsMap, mapChannels) => {
      if (myChannelsMap.get(channelPostId)) {
        return false;
      } else if (mapChannels.get(channelPostId)) {
        return true;
      } else {
        //waiting sync, but the join is available anyway
        return true;
      }
    },
  );

export default updateFeedJoin;
