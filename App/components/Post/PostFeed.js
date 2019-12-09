import React from 'react';
import StyleSheet from 'react-native-extended-stylesheet';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import Post from './Post';
import updateFeedJoin from '../../selectors/feedJoin';
import {evaluateChannelForMention} from '../../utils/parseChannelMention';

const PostFeed = ({
  id,
  postUserId,
  message,
  metada,
  createdAt,
  editedAt,
  type,
  post_props,
  channelPostId,
}) => {
  const joinFeedProps = {id};
  const user = useSelector(state => state.users.data[postUserId] || {});
  const mapChannels = useSelector(state => state.mapChannels);
  const isChannelForJoin = useSelector(state => {
    const localSelector = updateFeedJoin();
    return localSelector(state, joinFeedProps);
  });

  const channel = mapChannels.get(channelPostId);

  const postedChannelName = evaluateChannelForMention(channel);

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
        displayJoinButton={isChannelForJoin}
        channelId={channelPostId}
        post_props={post_props}
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
