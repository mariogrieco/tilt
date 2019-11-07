import React, {createRef, Fragment} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import moment from 'moment';
import StyleSheet from 'react-native-extended-stylesheet';
import {
  NavigationActions,
  withNavigation,
  SafeAreaView,
} from 'react-navigation';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import GoBack from '../components/GoBack';
import Post from '../components/Post/Post';
import ChannelHeader from '../components/ChannelHeader';
import Input from '../components/Input';
import Separator from '../components/Separator';
import NewMessageLabel from '../components/NewMessageLabel';
import SeparatorContainer from '../components/SeparatorContainer';
import {getJumpPostsOrtList} from '../selectors/getJumpPostList';
import {clearjumpToAction} from '../actions/advancedSearch';
import {getPostsForChannel} from '../actions/posts';
import {setViewChannel} from '../actions/channels';
import {setActiveFocusChannel} from '../actions/AppNavigation';
import parseChannelMention from '../utils/parseChannelMention';
import {channelScreen, channelTab} from '../utils/keyboardHelper';
import {setRepostActiveOnInput} from '../actions/repost';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    height: 100,
    left: 0,
    bottom: 0,
    right: 0,
    paddingHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
  },
  footerText: {
    fontFamily: 'SFProDisplay-bold',
    color: '$textColor',
    fontSize: 16,
    letterSpacing: 0.1,
    paddingTop: 12,
    paddingBottom: 15,
    textAlign: 'center',
  },
  footerButton: {
    borderRadius: 22,
    height: 44,
    width: '100%',
    backgroundColor: '$green',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 11,
  },
  footerBottonText: {
    fontSize: 18,
    letterSpacing: 0.1,
    color: '#fff',
    fontFamily: 'SFProDisplay-Medium',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  separatorText: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 14,
    letterSpacing: 0.1,
  },
  jumpLabelText: {
    color: '#fff',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 14,
    letterSpacing: 0.1,
  },
  jumpLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#017AFE',
    letterSpacing: 0.1,
  },
  archivedContainer: {
    height: 122,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d9d8d7',
  },
  archivedMessage: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    color: '#0e141e',
    letterSpacing: 0.1,
    textAlign: 'center',
    marginVertical: 15,
  },
  archivedButton: {
    marginBottom: 10,
    paddingTop: 12,
    paddingBottom: 11,
    backgroundColor: '#3fb87f',
    borderRadius: 22,
    width: '100%',
  },
  archivedButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'SFProDisplay-Medium',
    width: '100%',
  },
});

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');
const SEARCH = require('../../assets/themes/light/search/search.png');
const MENU = require('../../assets/themes/light/menu-black/menu.png');

const renderNewSeparator = () => (
  <View style={styles.separator}>
    <View style={{flex: 1}}>
      <Separator
        customStyles={{
          backgroundColor: '#FC3E30',
        }}
      />
    </View>
    <View style={{flex: 1, alignItems: 'center'}}>
      <Text style={[styles.separatorText, {color: '#FC3E30'}]}>
        New Messages
      </Text>
    </View>
    <View style={{flex: 1}}>
      <Separator
        customStyles={{
          backgroundColor: '#FC3E30',
        }}
      />
    </View>
  </View>
);

class Channel extends React.Component {
  static navigationOptions = ({navigation}) => ({
    // title: <ChannelHeader title={navigation.getParam('title', '')} />,
    headerLeft: (
      <View
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <GoBack
          icon={BACK}
          onPress={() => navigation.dispatch(NavigationActions.back())}
        />
        <ChannelHeader
          name={navigation.getParam('name', '')}
          create_at={navigation.getParam('create_at', '')}
          members={navigation.getParam('members', '')}
          fav={navigation.getParam('fav', '')}
          pm={navigation.getParam('pm', '')}
          isAdminCreator={navigation.getParam('isAdminCreator', '')}
        />
      </View>
    ),
    headerRight: (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {!navigation.getParam('pm', '') && (
          <Fragment>
            <TouchableOpacity
              style={{paddingVertical: 10, paddingLeft: 20, paddingRight: 5}}
              onPress={() => navigation.navigate('AdvancedSearch')}>
              <Image source={SEARCH} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{paddingVertical: 10, paddingLeft: 20, paddingRight: 15}}
              onPress={() => navigation.navigate('ChannelInfo')}>
              <Image source={MENU} />
            </TouchableOpacity>
          </Fragment>
        )}
      </View>
    ),
  });

  state = {
    postActive: false,
    postId: '',
    userId: '',
    loadingSpiner: false,
    scrollLabel: false,
    offset: false,
    initialNumToRender: 10,
    isArchived: false,
  };

  lastSeparatorEnd = true;

  scrollView = createRef();

  constructor(props) {
    super(props);
    switch (props.displayAs) {
      case 'tab':
        this.keyboardConfig = channelTab;
        break;
      case 'screen':
        this.keyboardConfig = channelScreen;
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    this.navigationListener = this.props.navigation.addListener(
      'didFocus',
      this.checkFocusedPost,
    );
    if (this.props.flagCount) {
      this.setState({
        scrollLabel: true,
      });
    }

    this.navigationListenerBlur = this.props.navigation.addListener(
      'willBlur',
      this.clear,
    );
  }

  clear = () => {
    this.props.setRepostActiveOnInput(null);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.offset) {
      if (
        nextProps.posts.length > 0 &&
        nextProps.posts[0] &&
        this.props.posts[0]
      ) {
        if (nextProps.posts[0].id !== this.props.posts[0].id) {
          if (nextProps.posts[0].user_id !== this.props.me) {
            this.setState({
              scrollLabel: true,
              flagCount: nextProps.posts.length - this.props.posts.length,
            });
          } else {
            this.setState({
              scrollLabel: false,
            });
          }
        }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentWillUnmount() {
    if (this.props.activeJumpLabel) {
      this.props.clearjumpToAction();
    } else {
      this._setViewChanel();
    }

    if (this.navigationListener) {
      this.navigationListener.remove();
    }

    if (this.navigationListenerBlur) {
      this.navigationListenerBlur.remove();
    }

    this.setState({
      currentFocusId: null,
    });

    this.props.setActiveFocusChannel('');
  }

  async _setViewChanel() {
    try {
      const {channel_id, setViewChannel, prev_active_channel_id} = this.props;
      await setViewChannel(channel_id, prev_active_channel_id || '');
    } catch (err) {
      alert(err);
    }
  }

  _findIndex(id) {
    let match = null;
    this.props.posts.forEach((post, index) => {
      if (post.id === id) {
        match = index;
      }
    });
    return match;
  }

  // async findIndexById(id) {
  //   const {stop} = this.props;
  //   try {
  //     let match = this._findIndex(id);
  //     while (match === null && !stop) {
  //       await this._fetchMore();
  //       match = this._findIndex(id);
  //     }
  //     return match || 0;
  //   } catch (err) {
  //     return 0;
  //   }
  //   return match;
  // }

  checkFocusedPost = async () => {
    const {navigation} = this.props;
    const focusedTo = navigation.getParam('focusOn', null);
    if (focusedTo) {
      const currentIndex = this._findIndex(focusedTo);
      // alert(currentIndex);
      try {
        this.scrollToIndex(currentIndex);
        this.setState(
          {
            currentFocusId: focusedTo,
          },
          () => {
            setTimeout(() => {
              this.setState({
                currentFocusId: null,
              });
            }, 6000);
          },
        );
      } catch (err) {
        //  alert(err);
      }
    }
  };

  getSeparator(createdAt, index) {
    const {posts} = this.props;
    if (index === 0 && posts[index + 1]) {
      this.lastSeparatorEnd = posts[index].create_at;
      if (
        (!this.sameDay(posts[index + 1].create_at, this.lastSeparatorEnd) &&
          !this.sameMonth(posts[index + 1].create_at, this.lastSeparatorEnd)) ||
        !this.sameYear(posts[index + 1].create_at, this.lastSeparatorEnd)
      ) {
        this.lastSeparatorEnd = posts[index + 1].create_at;
        return this.renderSeparator(posts[index].create_at);
      }
      this.lastSeparatorEnd = posts[index + 1].create_at;
    } else if (posts[index + 1]) {
      if (
        (!this.sameDay(posts[index + 1].create_at, this.lastSeparatorEnd) &&
          !this.sameMonth(posts[index + 1].create_at, this.lastSeparatorEnd)) ||
        !this.sameYear(posts[index + 1].create_at, this.lastSeparatorEnd)
      ) {
        const last = this.lastSeparatorEnd;
        this.lastSeparatorEnd = posts[index + 1].create_at;
        return this.renderSeparator(last);
      }
      this.lastSeparatorEnd = posts[index + 1].create_at;
    } else {
      return (
        <View>
          {this.renderSeparator(createdAt)}
        </View>
      );
    }
  }

  toggleScrollLabel = () => {
    this.setState(({scrollLabel}) => ({
      scrollLabel: !scrollLabel,
    }));
  };

  _renderItem = ({item, index}) => (
    <View
      style={
        this.state.currentFocusId === item.id
          ? {backgroundColor: '#FCF4DD'}
          : {}
      }>
      {item.render_separator && renderNewSeparator()}
      <View>
        {this.getSeparator(item.create_at, index)}
        <Post
          allowRepost
          postId={item.id}
          userId={item.user.id}
          last_picture_update={item.user.last_picture_update}
          message={item.message}
          username={item.user.username}
          metadata={item.metadata}
          createdAt={item.create_at}
          replies={item.replies}
          edit_at={item.edit_at}
          type={item.type}
          isPM={this.props.navigation.getParam('pm', false)}
        />
      </View>
    </View>
  );

  _keyExtractor = (item, index) => item.id;

  scrollToEnd = () => {
    if (this.scrollView.current) {
      this.scrollView.current.scrollToIndex({
        animated: true,
        viewPosition: 0,
        index: 0,
      });
      this.closeNewLabel();
    }
  };

  scrollToIndex = index => {
    if (this.scrollView.current) {
      this.scrollView.current.scrollToIndex({animated: true, index});
    }
  };

  closeModal = () => {
    this.setState({
      postActive: false,
    });
  };

  redirectToChannels = () => {
    const {navigation} = this.props;
    navigation.navigate('PublicChat');
  };

  // eslint-disable-next-line class-methods-use-this
  sameDay(createdAt, lastDateOrNow) {
    if (moment(createdAt).format('DD') === moment(lastDateOrNow).format('DD')) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  sameMonth(createdAt, lastDateOrNow) {
    if (moment(createdAt).format('MM') === moment(lastDateOrNow).format('MM')) {
      return false;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  sameYear(createdAt, lastDateOrNow) {
    if (
      moment(createdAt).format('YYYY') === moment(lastDateOrNow).format('YYYY')
    ) {
      return true;
    }
    return false;
  }

  _onEndReached = ({distanceFromEnd}) => {
    if (distanceFromEnd <= 0) {
      if (this.props.activeJumpLabel) {
        return true;
      }
      if (this.state.loadingSpiner) {
        return false;
      }
      if (this.props.stop) {
        return this.setState({loadingSpiner: false});
      }

      if (!this.state.loadingSpiner) {
        this.setState(
          {
            loadingSpiner: true,
          },
          this._fetchMore,
        );
      }
    }
  };

  async _fetchMore(pagination) {
    try {
      let {page, getPostsForChannel, channel_id} = this.props;
      await getPostsForChannel(channel_id, ++page, pagination);
    } catch (err) {
      alert(err);
    } finally {
      setTimeout(() => {
        this.setState({
          loadingSpiner: false,
        });
      }, 0);
    }
  }

  closeNewLabel = () => {
    this.setState({
      scrollLabel: false,
      offset: false,
    });
  };

  // eslint-disable-next-line class-methods-use-this
  renderSeparator(createdAt = false) {
    return <SeparatorContainer createdAt={createdAt} />;
  }

  closeLabel = () => {
    this.closeNewLabel();
  };

  _setScrollPosition = event => {
    if (event.nativeEvent.contentOffset.y > 300) {
      this.setState({
        offset: true,
      });
    } else {
      this.setState({
        offset: false,
        scrollLabel: false,
      });
    }
  };

  onJumpLabel = () => {
    this.props.clearjumpToAction();
    this.setState({
      currentFocusId: null,
    });
    this.scrollToEnd();
  };

  renderJumpLabel = () => (
    <TouchableOpacity onPress={this.onJumpLabel} style={styles.jumpLabel}>
      <Text style={styles.jumpLabelText}>
        Click here to jump to recent messages.
      </Text>
    </TouchableOpacity>
  );

  getItemLayout = (data, index) => ({length: 0, offset: 73 * index, index});

  getPlaceHolder() {
    const {navigation, channel, isDollar} = this.props;
    const isAdminCreator = navigation.getParam('isAdminCreator', '') || isDollar;
    const isPrivateMessage = navigation.getParam('pm', '');
    const title = isPrivateMessage
      ? navigation.getParam('name', '')
      : channel.name;

    if (isAdminCreator) {
      return `Write to $${parseChannelMention(title)}`;
    }

    if (isPrivateMessage) {
      return `Write to @${parseChannelMention(title)}`;
    }

    return `Write to #${parseChannelMention(title)}`;
  }

  renderLoadingItem = () => {
    if (this.state.loadingSpiner && !this.props.stop) {
      return (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 15,
            minHeight: 150,
            maxHeight: 150,
            height: 150,
          }}>
          <ActivityIndicator size="large" color="#17C491" />
        </View>
      );
    }
    return (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 15,
          minHeight: 150,
          maxHeight: 150,
          height: 150,
        }}
      />
    );
  };

  render() {
    const {channel, posts, activeJumpLabel, isArchived} = this.props;
    const {scrollLabel} = this.state;
    const placeholder = this.getPlaceHolder();
    const flagCount = this.props.flagCount || this.state.flagCount;
    return (
      <SafeAreaView
        forceInset={{top: 'never', bottom: 'always'}}
        style={{flex: 1}}>
        {!activeJumpLabel && scrollLabel && flagCount > 0 && (
          <NewMessageLabel
            length={flagCount}
            onClose={this.closeLabel}
            onPress={this.scrollToEnd}
          />
        )}
        <FlatList
          ListFooterComponent={this.renderLoadingItem}
          ref={this.scrollView}
          data={posts}
          inverted
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0}
          keyExtractor={this._keyExtractor}
          onScrollEndDrag={this._setScrollPosition}
          onMomentumScrollEnd={this._setScrollPosition}
          extraData={posts}
          initialNumToRender={50}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 0}}
          keyboardDismissMode="on-drag"
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={150}
          removeClippedSubviews={Platform.OS === 'android'}
        />
        {activeJumpLabel && this.renderJumpLabel()}

        {isArchived ? (
          <View style={styles.archivedContainer}>
            <Text style={styles.archivedMessage}>
              Your are viewing an{' '}
              <Text style={{fontFamily: 'SFProDisplay-Bold'}}>
                archived channel.
              </Text>{' '}
              New messages cannot be posted.
            </Text>
            <TouchableOpacity
              style={styles.archivedButton}
              onPress={() =>
                this.props.navigation.dispatch(NavigationActions.back())
              }>
              <Text style={styles.archivedButtonText}>Close Channel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <KeyboardAvoidingView
            keyboardVerticalOffset={this.keyboardConfig.offset}
            behavior={this.keyboardConfig.behavior}
            >
            <Input placeholder={placeholder} channelId={channel.id} />
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    );
  }
}

Channel.defaultProps = {
  //  values: [screen, tab]
  displayAs: 'screen',
};

const mapStateToProps = state => {
  const data = getJumpPostsOrtList(state, true);
  const {lastViewed} = state;
  const {active_channel_id, prev_active_channel_id} = state.appNavigation;
  const channel = state.myChannelsMap.get(active_channel_id) || {};
  const isArchived =
    findIndex(state.archivedChannels, ['channelId', active_channel_id]) !== -1;

  return {
    ...data,
    me: state.login.user ? state.login.user.id : null,
    page: state.posts.orders[active_channel_id]
      ? state.posts.orders[active_channel_id].page
      : 0,
    stop: state.posts.orders[active_channel_id]
      ? state.posts.orders[active_channel_id].stop
      : false,
    channel_id: active_channel_id,
    prev_active_channel_id,
    last_view_at: lastViewed[active_channel_id],
    channel: channel,
    isPM: channel.type === 'D',
    isArchived,
  };
};

const mapDispatchToProps = {
  getPostsForChannel,
  setViewChannel,
  setActiveFocusChannel,
  clearjumpToAction,
  setRepostActiveOnInput,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Channel),
);
