import React, {useMemo} from 'react';
import StyleSheet from 'react-native-extended-stylesheet';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import Post from './Post';

const PostFeed = ({
  id,
  postUserId,
  message,
  metada,
  createdAt,
  editedAt,
  type,
  postedChannelName,
}) => {
  const user = useSelector(state => state.users.data[postUserId] || {});
  const channelPostId = useSelector(state => state.feeds.posts[id].channel_id);
  const myChannelsMap = useSelector(state => state.myChannelsMap);
  const mapChannels = useSelector(state => state.mapChannels);

  const searchChannel = (channelPostId, myChannelsMap, mapChannels) => {
    console.log('evaluando', channelPostId);
    if (myChannelsMap.get(channelPostId)) {
      return false;
    } else if (mapChannels.get(channelPostId)) {
      return true;
    } else {
      //here goes the search to the server
      return true;
    }
  };

  const isChannelForJoin = useMemo(
    () => searchChannel(channelPostId, myChannelsMap, mapChannels),
    [myChannelsMap, channelPostId, mapChannels],
  );

  return (
    <View style={styles.container}>
      <Post
        postId={id}
        userId={postUserId}
        last_picture_update={user.last_picture_update}
        message={message}
        metadata={metada}
        createdAt={createdAt}
        edit_at={editedAt}
        type={type}
        username={user.username}
        extendedDateFormat
        postedChannelName={postedChannelName}
        isFeedPost
        displayJoinButton={isChannelForJoin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
});

export default PostFeed;
