import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Separator from '../Separator';
import PostFeed from '../Post/PostFeed';
import {getFeeds} from '../../actions/feeds';
import {searchMultiple} from '../../actions/search';
import parse_channel_name from '../../utils/fix_name_if_need';

const Feeds = ({navigation}) => {
  const feeds = useSelector(state => state.feeds);
  const keysForInclude = useSelector(state =>
    state.feeds.channels_keys
      .filter(key => !state.mapChannels.get(key))
      .map(key => state.feeds.channels[key].name),
  );
  const blockedUsers = useSelector(state => state.blockedUsers);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  useEffect(() => {
    const includeFeedsIntoChannels = async () => {
      try {
        console.log('llamado a sync');
        await dispatch(searchMultiple(keysForInclude));
      } catch (err) {
        console.log(err);
      }
    };
    includeFeedsIntoChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, feeds]);

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      dispatch(getFeeds());
    });

    const clean = () => {
      focusListener.remove();
    };

    return clean;
  }, [dispatch, navigation]);

  const evaluateChannelForMention = channel => {
    if (channel.name === 'welcome') {
      return '#welcome';
    }
    const name = `${channel.content_type !== 'N' ? '$' : '#'}${
      channel.display_name
    }`;
    return name;
  };

  const renderItem = ({item: postId}) => {
    const post = feeds.posts[postId];
    const channel = parse_channel_name(feeds.channels[post.channel_id]);
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
