import React, {useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Separator from '../Separator';
import PostFeed from '../Post/PostFeed';
import {getFeeds} from '../../actions/feeds';
import {searchChannels} from '../../actions/search';
import parse_channel_name from '../../utils/fix_name_if_need';

const Feeds = ({navigation}) => {
  const feeds = useSelector(state => state.feeds);
  const mapChannels = useSelector(state => state.mapChannels);
  const blockedUsers = useSelector(state => state.blockedUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, [dispatch]);

  useEffect(() => {
    const includeFeedsIntoChannels = async () => {
      try {
        const keysForInclude = feeds.channels_keys.filter(
          key => !mapChannels.get(key),
        );
        const searchs = [];
        keysForInclude.forEach(key =>
          searchs.push(
            dispatch(searchChannels(null, feeds.channels[key].name)),
          ),
        );
        await Promise.all(searchs);
      } catch (err) {
        console.log(err);
      }
    };
    includeFeedsIntoChannels();
  }, [dispatch, feeds, mapChannels]);

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
    const name = `${channel.content_type !== 'N' ? '$' : '#'}${channel.name}`;
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
