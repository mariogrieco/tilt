import React, {useCallback, useEffect} from 'react';
import {FlatList, Text, View, ActivityIndicator, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Separator from '../Separator';
import {getFollowTimeLine} from '../../actions/follow';

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

  const handleListEnd = useCallback(async () => {
    try {
      await dispatch(getFollowTimeLine());
    } catch (err) {
      Alert(err);
    }
  }, [dispatch]);

  const LoadingIndicator = useCallback(() => {
    if (followingTimeline.isLoading) {
      return <Loader />;
    } else {
      return null;
    }
  }, [followingTimeline.isLoading]);

  const renderItem = ({item}) => {
    return (
      <View style={{height: 80}}>
        <Text>{item}</Text>
      </View>
    );
  };

  useEffect(() => {
    dispatch(getFollowTimeLine());
  }, [dispatch]);

  return (
    <View>
      <Text>
        length {followingTimeline.posts_ids.length} page{' '}
        {followingTimeline.page}
      </Text>
      <FlatList
        data={followingTimeline.posts_ids}
        renderItem={renderItem}
        keyExtractor={item => item}
        onEndReached={handleListEnd}
        onEndReachedThreshold={0}
        ListFooterComponent={LoadingIndicator}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

export default FollowingTimeline;
