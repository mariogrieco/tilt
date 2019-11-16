import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import PostPreview from '../PostPreview';
import {getFess} from '../../actions/fees';

const Fees = ({navigation}) => {
  const fees = useSelector(state => state.fees);
  const dispatch = useDispatch();

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      dispatch(getFess());
    });

    const clean = () => {
      focusListener.remove();
    };

    return clean;
  }, [dispatch, navigation]);

  const renderItem = ({item: channelId}) => {
    const channel = fees.channels[channelId];
    const post = fees.posts[channel.post_id];
    return (
      <PostPreview
        id={post.id}
        metada={post.metada}
        postUserId={post.user_id}
        message={post.message}
        createdAt={post.create_at}
        editedAt={post.edit_at}
        channelId={post.channel_id}
        type={post.type}
      />
    );
  };

  return (
    <FlatList
      style={{flex: 1}}
      data={fees.channels_keys}
      renderItem={renderItem}
      keyExtractor={item => item}
    />
  );
};

export default withNavigation(Fees);
