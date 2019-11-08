import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationActions, withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import GoBack from '../components/GoBack';
import Input from '../components/Input';
import Post from '../components/Post/Post';
import getThreadForPost from '../selectors/getThreadForPost';
import getPostById from '../selectors/getPostById';

import {ifIphoneX} from 'react-native-iphone-x-helper';
import parser from '../utils/parse_display_name';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
class Thread extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Thread',
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
    ...headerForScreenWithBottomLine({
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
      },
      headerTintColor: screenProps.theme.headerTintColor,
    }),
  });

  parsePlaceHolder(str = '') {
    return parser(str);
  }

  render() {
    const {channelId, thread, root_id, replyTo, theme} = this.props;
    const keyboardVerticalOffset =
      Platform.OS === 'ios' ? ifIphoneX(88, 60) : 0;
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        <ScrollView
          keyboardDismissMode="on-drag"
          contentContainerStyle={{paddingTop: 0}}>
          {thread.map(post => (
            <Post
              postId={post.id}
              userId={post.user ? post.user.id : ''}
              last_picture_update={
                post.user ? post.user.last_picture_update : ''
              }
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
          ))}
        </ScrollView>
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={Platform.OS === 'ios' ? 'position' : undefined}>
          <Input
            root_id={root_id}
            placeholder={`Reply to ${replyTo}'s message`}
            channelId={channelId}
          />
        </KeyboardAvoidingView>
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

const mapStateToProps = state => {
  const postData = state.posts.entities[state.appNavigation.active_thread_data];
  const root_id = postData ? getRootID(postData) : null;
  const rootPost = getPostById(state, root_id);
  return {
    thread: getThreadForPost(state, postData),
    replyTo: rootPost && rootPost.user ? rootPost.user.username : null,
    channelId: postData ? postData.channel_id : null,
    root_id,
    replyMessage: rootPost ? rootPost.message : '',
    theme: state.themes[state.themes.current],
  };
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Thread),
);
