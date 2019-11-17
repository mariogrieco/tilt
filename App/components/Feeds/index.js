import React, {useEffect, useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {withNavigation} from 'react-navigation';
import Separator from '../Separator';
import PureParsedText from '../Post/PureParsedText';
import PostPreview from '../PostPreview';
import {getFeeds} from '../../actions/feeds';
import {navigateIfExists} from '../../actions/channels';
import {getChannelDisplayNameAsDictionary} from '../../selectors/getChannelNames';

const Feeds = ({navigation}) => {
  const feeds = useSelector(state => state.feeds);
  const channelMentions = useSelector(getChannelDisplayNameAsDictionary);
  const dispatch = useDispatch();

  const memoNavigate = useCallback(
    value => {
      dispatch(navigateIfExists(value));
    },
    [dispatch],
  );

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

    const isHashtagChannel = channelMentions.hashtagChannels[post.channel_id]
      ? `#${channelMentions.hashtagChannels[post.channel_id]} `
      : '';

    const isDollarChannel = channelMentions.dollarChannels[post.channel_id]
      ? `$${channelMentions.dollarChannels[post.channel_id]} `
      : '';

    const channelNamePrint = `${isHashtagChannel || isDollarChannel || ''}`;

    return (
      <View>
        <PureParsedText
          message={channelNamePrint}
          typeIsSystem={false}
          onChannel={memoNavigate}
        />
        <PostPreview
          id={post.id}
          metada={post.metada}
          postUserId={post.user_id}
          message={post.message}
          createdAt={post.create_at}
          editedAt={post.edit_at}
          type={post.type}
        />
      </View>
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
