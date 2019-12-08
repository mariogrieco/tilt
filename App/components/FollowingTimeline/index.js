import React, {useCallback, useEffect} from 'react';
import {FlatList, View, ActivityIndicator, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Separator from '../Separator';
import PostFeed from '../Post/PostFeed';
import {getFollowTimeLine} from '../../actions/follow';

const Loader = () => {
  const theme = useSelector(state => state.themes[state.themes.current]);
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: theme.primaryBackgroundColor,
      }}>
      <ActivityIndicator size="large" color="#17C491" />
    </View>
  );
};

const FollowingTimeline = () => {
  const dispatch = useDispatch();
  const followingTimeline = useSelector(state => state.followingTimeline);

  const handleListEnd = useCallback(async () => {
    try {
      if (!followingTimeline.isLoading) {
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
        channelPostId={post.channel_id}
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
    <View style={{flex: 1, position: 'relative'}}>
      <LoadingIndicator />
      <FlatList
        data={followingTimeline.posts_ids}
        renderItem={renderItem}
        keyExtractor={item => item}
        onEndReached={handleListEnd}
        onEndReachedThreshold={0.05}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

export default FollowingTimeline;
