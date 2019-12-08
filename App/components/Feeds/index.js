import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Separator from '../Separator';
import PostFeed from '../Post/PostFeed';
import {getFeeds} from '../../actions/feeds';
import parse_channel_name from '../../utils/fix_name_if_need';
import {evaluateChannelForMention} from '../../utils/parseChannelMention';

const Feeds = ({navigation}) => {
  const feeds = useSelector(state => state.feeds);

  const blockedUsers = useSelector(state => state.blockedUsers);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      dispatch(getFeeds());
    });

    const clean = () => {
      focusListener.remove();
    };

    return clean;
  }, [dispatch, navigation]);

  const renderItem = ({item: postId}) => {
    const post = feeds.posts[postId];

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

  return (
    <FlatList
      style={{flex: 1}}
      data={feeds.posts_keys.filter(
        key => !blockedUsers[feeds.posts[key].user_id],
      )}
      renderItem={renderItem}
      keyExtractor={item => item}
      ItemSeparatorComponent={Separator}
    />
  );
};

export default withNavigation(Feeds);
