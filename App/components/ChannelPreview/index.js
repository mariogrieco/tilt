import React, {Component} from 'react';
import {View, Text, SafeAreaView, FlatList} from 'react-native';
import {connect} from 'react-redux';
import JoinButton from '../JoinButton';
import Post from '../Post/Post';
import {getChanelPreview} from '../../actions/channelPreview';
import JoinBigBtn from '../JoinBigBtn';
import parser from '../../utils/parse_display_name';
import StyleSheet from 'react-native-extended-stylesheet';

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

class ChannelPreview extends Component {
  state = {
    load: false,
  };

  async componentDidMount() {
    const {posts, channel_id} = this.props;
    if (!posts || posts.length === 0) {
      await this.props.getChanelPreview(channel_id);
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      load: true,
    });
  }

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
      // thread
      // no_actions
      disableInteractions
      showPreviewDots
      replies={post.replies}
      isReply
      disableDots
      post_props={post.props}
    />
  );

  renderPrefix() {
    const {channel} = this.props;
    switch (channel.content_type) {
      case 'S':
        return '$';
      case 'C':
        return '$';
      case 'N':
        return '#';
      default:
        return '';
    }
  }

  displayName() {
    const {channel} = this.props;
    const isNormal = channel.content_type === 'N';
    const name = `${this.renderPrefix()}${parser(channel.display_name)}`;
    if (isNormal) {
      return name;
    }
    return name.toUpperCase();
  }

  render() {
    const {posts, theme, channel_id} = this.props;
    const {load} = this.state;
    if (!load) {
      return null;
    }
    return (
      <SafeAreaView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        {false ? (
          <JoinBigBtn />
        ) : (
          // eslint-disable-next-line react-native/no-inline-styles
          <View style={{flex: 1}}>
            <FlatList
              keyboardDismissMode="on-drag"
              // eslint-disable-next-line react-native/no-inline-styles
              contentContainerStyle={{paddingTop: 0}}
              data={posts}
              renderItem={this.renderItem}
            />
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
                Join {this.displayName()} to start commenting.
              </Text>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={[{paddingLeft: 15, paddingRight: 15, width: '100%'}]}>
                <JoinButton
                  buttonStyle={styles.joinButtonContainer}
                  textStyle={styles.joinButtonText}
                  displayText={`Join ${this.displayName()}`}
                  channelId={channel_id}
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  posts: (state.channelPreview[ownProps.channel_id] || []).map(post => {
      return {
        ...post,
        user: state.users.data[post.user_id],
      };
    })
    .filter(post => !state.blockedUsers[post.user_id]),
  theme: state.themes[state.themes.current],
  channel: state.mapChannels.get(ownProps.channel_id) || {},
});

const mapDispatchToProps = {
  getChanelPreview,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelPreview);
