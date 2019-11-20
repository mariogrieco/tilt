import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import StyleSheet from 'react-native-extended-stylesheet';
import GoBack from '../components/GoBack';
import Input from '../components/Input';
import Post from '../components/Post/Post';
import JoinButton from '../components/JoinButton';
import {addToChannel} from '../actions/channels';
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
    fontFamily: 'SFProDisplay-Medium',
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
    headerRight: navigation.getParam('displayJoinButton', false) ? (
      <JoinButton channelId={navigation.getParam('channelForJoin', '')} />
    ) : null,
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

  componentDidMount() {
    const {navigation, needJoin, channelId} = this.props;
    navigation.setParams({
      displayJoinButton: needJoin,
      channelForJoin: channelId,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.needJoin !== this.props.needJoin) {
      this.props.navigation.setParams({
        displayJoinButton: this.props.needJoin,
      });
    }
  }

  render() {
    const {channelId, thread, root_id, replyTo, theme, needJoin} = this.props;
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
                borderTopColor: theme.borderBottomcolor,
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
              Join to replace-me start commenting.
            </Text>
            <View style={[{paddingLeft: 14, paddingRight: 15, width: '100%'}]}>
              <TouchableOpacity
                style={[
                  styles.joinButtonContainer,
                  {
                    backgroundColor: theme.tiltGreen,
                  },
                ]}
                onPress={() => this.props.addToChannel(null, channelId)}>
                <Text
                  style={[
                    styles.joinButtonText,
                    {
                      color: theme.primaryBackgroundColor,
                    },
                  ]}>
                  Join replace-me
                </Text>
              </TouchableOpacity>
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

const mapDispatchToProps = {
  addToChannel,
};

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
  const localFeedJoin = updateFeedJoin();

  if (postEntity) {
    console.log('lo encontre en entities');
    const root_id = getRootID(postEntity);
    const rootPost = getPostById(state, root_id);
    return {
      needJoin: localFeedJoin(state, {id: postEntity.id}),
      thread: getThreadForPost(state, postEntity),
      root_id,
      channelId: postEntity.channel_id,
      replyTo: rootPost && rootPost.user ? rootPost.user.username : null,
      replyMessage: rootPost.message,
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
    console.log('thread a renderizar', thread);

    return {
      needJoin: localFeedJoin(state, {id: postFeed.id}),
      thread,
      root_id: postFeed.id,
      channelId: postFeed.channel_id,
      replyTo: state.users.data[postFeed.user_id].username,
      replyMessage: postFeed.message,
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

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
