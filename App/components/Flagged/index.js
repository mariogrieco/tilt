import React from 'react';
import {FlatList, View, TouchableOpacity, Text, Image} from 'react-native';
import {connect} from 'react-redux';
import getFlagged from '../../selectors/getFlagged';
import Post from '../Post/Post';
import NavigationService from '../../config/NavigationService';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import styles from './styles';
import BottomBlockSpaceSmall from '../BottomBlockSpaceSmall';
import parser from '../../utils/parse_display_name';

const MOON = require('../../../assets/themes/light/flagged_moon/flagged_moon.png');

class Flagged extends React.PureComponent {
  renderItem = ({item: channel}) => {
    const channelName = `${channel.prefix}${channel.show_name}`;
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{backgroundColor: '#fff'}}>
        <TouchableOpacity
          style={styles.channelTitleContainer}
          onPress={() => {
            this.props.setActiveFocusChannel(channel.id);
            NavigationService.navigate('Channel', {
              name: channelName
                .replace('$', '')
                .replace('#', '')
                .replace('@', ''),
              members: channel.members,
              create_at: channel.create_at,
              fav: channel.fav,
              pm: channel.type === 'D',
            });
          }}>
          <Text
            style={[
              styles.channelTitle,
              {paddingTop: 5},
            ]}>{channelName}</Text>
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
          />
        ))}
        <BottomBlockSpaceSmall />
      </View>
    );
  };

  renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Image source={MOON} />
      <Text style={styles.emptyText}>
        Do you find a post interesting? Flag it, and come back to it later.
      </Text>
    </View>
  );

  parseName(channelName = '') {
    return parser(channelName);
  }

  render() {
    const {flagged_channels} = this.props;
    return (
      <FlatList
        data={flagged_channels}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        ListEmptyComponent={this.renderEmptyList}
        style={styles.listContainer}
      />
    );
  }
}

const mapStateToProps = state => ({
  ...getFlagged(state),
});
const mapDispatchToProps = {
  setActiveFocusChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Flagged);
