import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  Text,
  View,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import StyleSheet from 'react-native-extended-stylesheet';
import GoBack from '../components/GoBack';
import Input from '../components/Input';
import Post from '../components/Post/Post';
import JoinButton from '../components/JoinButton';
import getThreadForPost from '../selectors/getThreadForPost';
import getPostById from '../selectors/getPostById';
import updateFeedJoin from '../selectors/feedJoin';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

const styles = StyleSheet.create({
  joinContainer: {
    height: 122,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  joinMessageText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  joinButtonContainer: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonText: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
  },
});
class Thread extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Thread',
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
    ...headerForScreenWithBottomLine({
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
      headerTintColor: screenProps.theme.headerTintColor,
    }),
  });

  renderItem = ({item: post}) => (
    <Post
      postId={post.id}
      userId={post.user_id}
      last_picture_update={post.user ? post.user.last_picture_update : ''}
      key={post.id}
      message={post.message}
      username={post.user ? post.user.username : ''}
      metadata={post.metadata}
      createdAt={post.create_at}
      type={post.type}
      edit_at={post.edit_at}
      thread
      replies={post.replies}
      // channelsNames={channelsNames}
      // usernames={usernames}
      isReply
    />
  );

  render() {
    const {
      channelId,
      thread,
      root_id,
      replyTo,
      theme,
      needJoin,
      channelName,
    } = this.props;
    const keyboardVerticalOffset =
      Platform.OS === 'ios' ? ifIphoneX(88, 60) : 0;
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        <FlatList
          keyboardDismissMode="on-drag"
          contentContainerStyle={{paddingTop: 0}}
          data={thread}
          renderItem={this.renderItem}
        />
        {needJoin ? (
          //inline styles will removed soon to styles
          <View
            style={[
              styles.joinContainer,
              {
                borderTopColor: theme.borderBottomColor,
                backgroundColor: theme.primaryBackgroundColor,
              },
            ]}>
            <Text
              style={[
                styles.joinMessageText,
                {
                  color: theme.primaryTextColor,
                },
              ]}>
              Join {channelName} to start commenting.
            </Text>
            <View style={[{paddingLeft: 15, paddingRight: 15, width: '100%'}]}>
              <JoinButton
                buttonStyle={styles.joinButtonContainer}
                textStyle={styles.joinButtonText}
                displayText={`Join ${channelName}`}
                channelId={channelId}
              />
            </View>
          </View>
        ) : (
          <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS === 'ios' ? 'position' : undefined}>
            <Input
              root_id={root_id}
              placeholder={`Reply to ${replyTo}'s message`}
              channelId={channelId}
            />
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {};

function getRootID(post) {
  if (
    !!post.parent_id &&
    post.parent_id !== '' &&
    post.parent_id.trim() !== ''
  ) {
    return post.parent_id;
  }
  return post.id;
}

// this will me move to selector folder soon.

const threadSelector = state => {
  const activePost = state.appNavigation.active_thread_data;
  const postEntity = state.posts.entities[activePost];
  const postFeed = state.feeds.posts[activePost];
  const mapChannels = state.mapChannels;
  const adminIds = state.adminCreators;
  const localFeedJoin = updateFeedJoin();

  if (postEntity) {
    console.log('lo encontre en entities');
    const root_id = getRootID(postEntity);
    const rootPost = getPostById(state, root_id);
    const originChannel = mapChannels.get(postEntity.channel_id);
    const channelName = `${
      adminIds.includes(originChannel.creator_id) ? '$' : '#'
    }${originChannel ? originChannel.name : ''}`;
    return {
      needJoin: localFeedJoin(state, {id: postEntity.id}),
      thread: getThreadForPost(state, postEntity),
      root_id,
      channelId: postEntity.channel_id,
      replyTo: rootPost && rootPost.user ? rootPost.user.username : null,
      replyMessage: rootPost.message,
      channelName,
    };
  }

  if (postFeed) {
    console.log('lo encontre en feed');
    const thread = [
      postFeed,
      ...postFeed.feed_thread.map(
        postReplyKey => state.feeds.posts[postReplyKey],
      ),
    ];
    const originChannel = mapChannels.get(postFeed.channel_id);
    const channelName = `${
      adminIds.includes(originChannel.creator_id) ? '$' : '#'
    }${originChannel ? originChannel.name : ''}`;
    return {
      needJoin: localFeedJoin(state, {id: postFeed.id}),
      thread,
      root_id: postFeed.id,
      channelId: postFeed.channel_id,
      replyTo: state.users.data[postFeed.user_id].username,
      replyMessage: postFeed.message,
      channelName,
    };
  }

  console.log('no encontre nada');

  return {
    thread: [],
    replyTo: null,
    channelId: null,
    root_id: null,
    replyMessage: '',
  };
};

const mapStateToProps = state => {
  return {
    ...threadSelector(state),
    theme: state.themes[state.themes.current],
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Thread);
