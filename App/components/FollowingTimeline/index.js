import React, {useCallback, useEffect} from 'react';
import {FlatList, Text, View, ActivityIndicator, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Separator from '../Separator';
import PostFeed from '../Post/PostFeed';
import {getFollowTimeLine} from '../../actions/follow';
import {evaluateChannelForMention} from '../../utils/parseChannelMention';

const Loader = () => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
      }}>
      <ActivityIndicator size="large" color="#17C491" />
    </View>
  );
};

const FollowingTimeline = () => {
  const dispatch = useDispatch();
  const followingTimeline = useSelector(state => state.followingTimeline);
  const mapChannels = useSelector(state => state.mapChannels);

  const handleListEnd = useCallback(async () => {
    try {
      if (!followingTimeline.isLoading) {
        console.log('hola');
        await dispatch(getFollowTimeLine());
      }
    } catch (err) {
      Alert(err);
    }
  }, [dispatch, followingTimeline.isLoading]);

  const LoadingIndicator = useCallback(() => {
    if (followingTimeline.isLoading) {
      return <Loader />;
    } else {
      return null;
    }
  }, [followingTimeline.isLoading]);

  const renderItem = ({item}) => {
    const post = followingTimeline.post_entities[item];

    const channel = mapChannels.get(post.channel_id);

    const postedChannelName = evaluateChannelForMention(channel);
    return (
      <PostFeed
        id={post.id}
        metada={post.metadata}
        postUserId={post.user_id}
        message={post.message}
        createdAt={post.create_at}
        editedAt={post.edit_at}
        type={post.type}
        post_props={post.props}
        postedChannelName={postedChannelName}
        channelPostId={channel.id}
      />
    );
  };

  useEffect(() => {
    if (followingTimeline.posts_ids.length === 0) {
      dispatch(getFollowTimeLine());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <FlatList
        data={followingTimeline.posts_ids}
        renderItem={renderItem}
        keyExtractor={item => item}
        onEndReached={handleListEnd}
        onEndReachedThreshold={0.05}
        ListHeaderComponent={LoadingIndicator}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

export default FollowingTimeline;
