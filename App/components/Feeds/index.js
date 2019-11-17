import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Separator from '../Separator';
import PostPreview from '../PostPreview';
import {getFeeds} from '../../actions/feeds';

const Feeds = ({navigation}) => {
  const feeds = useSelector(state => state.feeds);
  const adminCreators = useSelector(state => state.adminCreators);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      console.log('foco');
      dispatch(getFeeds());
    });

    const clean = () => {
      focusListener.remove();
    };

    return clean;
  }, [dispatch, navigation]);

  const renderItem = ({item: postId}) => {
    const post = feeds.posts[postId];
    const channel = feeds.channels[post.channel_id];
    const postedChannelName = `${
      adminCreators.includes(channel.creator_id) ? '$' : '#'
    }${channel.display_name}`;

    return (
      <PostPreview
        id={post.id}
        metada={post.metada}
        postUserId={post.user_id}
        message={post.message}
        createdAt={post.create_at}
        editedAt={post.edit_at}
        type={post.type}
        postedChannelName={postedChannelName}
      />
    );
  };

  return (
    <FlatList
      style={{flex: 1}}
      data={feeds.posts_keys}
      renderItem={renderItem}
      keyExtractor={item => item}
      ItemSeparatorComponent={Separator}
    />
  );
};

export default withNavigation(Feeds);
