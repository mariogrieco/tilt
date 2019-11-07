import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import GoBack from '../components/GoBack';
import Input from '../components/Input';
import Post from '../components/Post/Post';
import getPostById from '../selectors/getPostById';
import {getAllRootsByChannelId} from '../selectors/getAllRootsforPost';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import parser from '../utils/parse_display_name';

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');

class Thread extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Edit Message',
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  state = {
    postActive: null,
    postId: null,
    userId: null,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  closeModal = () => {
    this.setState({
      postActive: false,
    });
  };

  handlePostActive = (postId, userId) => {
    this.setState(({postActive}) => ({
      postActive: !postActive,
      postId,
      userId,
    }));
  };

  parsePlaceHolder(str = '') {
    return parser(str);
  }

  render() {
    const {postActive, postId, userId} = this.state;
    const {me, channelId, editedOrPost, channelsNames, usernames} = this.props;
    const keyboardVerticalOffset =
      Platform.OS === 'ios' ? ifIphoneX(88, 60) : 0;

    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          keyboardDismissMode="on-drag"
          contentContainerStyle={{flex: 1, paddingTop: 11}}>
          {editedOrPost.map(post => (
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
              onDotsPress={this.handlePostActive}
              replies={post.replies}
              // channelsNames={channelsNames}
              // usernames={usernames}
            />
          ))}
        </ScrollView>
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={Platform.OS === 'ios' ? 'position' : undefined}>
          <Input
            editable={editedOrPost[0].message || 'edit'}
            post={editedOrPost[0]}
            placeholder=""
            channelId={channelId}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = {};

const mapStateToProps = state => {
  const postId = state.appNavigation.active_edit_post_id;
  let post = getPostById(state, postId) || {};
  post = {...post};
  post.replies = getAllRootsByChannelId(post, post.channel_id, state);
  return {
    channelId: post ? post.channel_id : null,
    editedOrPost: [post || {message: ''}],
    me: state.login.user ? state.login.user.id : null,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Thread);
