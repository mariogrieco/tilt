import React from 'react';
import {FlatList, View, TouchableOpacity, Text, Image} from 'react-native';
import {connect} from 'react-redux';
import getFlagged from '../../selectors/getFlagged';
import Post from '../Post/Post';
import NavigationService from '../../config/NavigationService';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import styles from './styles';
import BottomBlockSpaceSmall from '../BottomBlockSpaceSmall';
import {selectedSymbol} from '../../actions/symbols';
import parser from '../../utils/parse_display_name';

const MOON = require('../../../assets/themes/light/flagged_moon/flagged_moon.png');

class Flagged extends React.PureComponent {
  navigatorAction(channel) {
    if (!channel) {
      return null;
    }
    this.props.setActiveFocusChannel(channel.id);
    let roomName = 'Channel';
    if (channel.content_type === 'S') {
      roomName = 'StockRoom';
      this.props.selectedSymbol({symbol: channel.display_name});
    } else if (channel.content_type === 'C') {
      this.props.selectedSymbol({symbol: channel.display_name});
      roomName = 'Room';
    }
    NavigationService.navigate(roomName, {
      title: parser(channel.display_name),
      create_at: channel.create_at,
      members: channel.members,
      fav: channel.fav,
      isAdminCreator: channel.content_type !== 'N',
    });
  }

  renderItem = ({item: channel}) => {
    const channelName = `${channel.prefix}${channel.show_name}`;
    const {theme} = this.props;
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{backgroundColor: theme.primaryBackgroundColor}}>
        <TouchableOpacity
          style={styles.channelTitleContainer}
          onPress={this.navigatorAction.bind(this, channel)}>
          <Text style={[styles.channelTitle, {paddingTop: 5}]}>
            {channelName}
          </Text>
        </TouchableOpacity>
        {channel.flagged.map(post => (
          <Post
            postId={post.id}
            userId={post.user.id}
            key={post.id}
            message={post.message}
            username={post.user ? post.user.username : ''}
            metadata={post.metadata}
            createdAt={post.create_at}
            edit_at={post.edit_at}
            type={post.type}
            extendedDateFormat
            post_props={post.props}
          />
        ))}
        <BottomBlockSpaceSmall />
      </View>
    );
  };

  renderEmptyList = () => {
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.emptyContainer,
          {backgroundColor: theme.secondaryBackgroundColor},
        ]}>
        <Image source={MOON} />
        <Text style={[styles.emptyText, {color: theme.placeholderTextColor}]}>
          Do you find a post interesting? Flag it, and come back to it later.
        </Text>
      </View>
    );
  };
  parseName(channelName = '') {
    return parser(channelName);
  }

  render() {
    const {flagged_channels} = this.props;
    const {theme} = this.props;
    return (
      <FlatList
        data={flagged_channels}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        ListEmptyComponent={this.renderEmptyList}
        style={[
          styles.listContainer,
          {backgroundColor: theme.secondaryBackgroundColor},
        ]}
      />
    );
  }
}

const mapStateToProps = state => ({
  ...getFlagged(state),
  theme: state.themes[state.themes.current],
});
const mapDispatchToProps = {
  setActiveFocusChannel,
  selectedSymbol,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Flagged);
