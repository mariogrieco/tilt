import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Separator from '../Separator';
import PostPreview from '../PostPreview';
import {getFeeds} from '../../actions/feeds';

const Feeds = ({navigation}) => {
  const feeds = useSelector(state => state.feeds);
  const dispatch = useDispatch();

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      dispatch(getFeeds());
    });

    const clean = () => {
      focusListener.remove();
    };

    return clean;
  }, [dispatch, navigation]);

  const renderItem = ({item: channelId}) => {
    const channel = feeds.channels[channelId];
    const post = feeds.posts[channel.post_id];
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
      data={feeds.channels_keys}
      renderItem={renderItem}
      keyExtractor={item => item}
      ItemSeparatorComponent={Separator}
    />
  );
};

export default withNavigation(Feeds);
