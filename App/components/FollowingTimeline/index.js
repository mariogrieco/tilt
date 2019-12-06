import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getFollowTimeLine} from '../../actions/follow';

const FollowingTimeline = () => {
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const followingTimeline = useSelector(state => state.followingTimeline);

  const handleListEnd = () => setPage(prevPage => prevPage + 1);

  useEffect(() => {
    console.log('cargar lista ', page);
    dispatch(getFollowTimeLine(page));
  }, [dispatch, page]);

  const renderItem = ({item}) => {
    return <Text>{item}</Text>;
  };

  return (
    <View>
      <Text>{followingTimeline.posts_ids.length}</Text>
      <FlatList
        data={followingTimeline.posts_ids}
        renderItem={renderItem}
        keyExtractor={item => item}
        onEndReached={handleListEnd}
        onEndReachedThreshold={0.25}
      />
    </View>
  );
};

export default FollowingTimeline;
