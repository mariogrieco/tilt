import React from 'react';
import {FlatList, Text, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import getPrivateMessagesChnnelsList from '../../selectors/getPrivateMessagesChnnelsList';
import Post from '../Post/Post';
import NavigationService from '../../config/NavigationService';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import styles from './styles';
import parser from '../../utils/parse_display_name';
import Separator from '../Separator';

const SATELLITE = require('../../../assets/themes/light/satellite/satellite.png');

class PrivateMessages extends React.Component {
  parseDisplayName(str = '') {
    return parser(str);
  }

  renderItem = ({item: channel}) => {
    const lastPost = channel.posts[0];
    const channelName = channel.show_name;
    const {theme} = this.props;
    return (
      <TouchableOpacity
        activeOpacity={1}
        key={channel.id}
        onPress={() => {
          this.props.setActiveFocusChannel(channel.id);
          NavigationService.navigate('Channel', {
            name: channelName,
            create_at: channel.create_at,
            members: channel.members,
            fav: channel.fav,
            pm: true,
          });
        }}
        style={{backgroundColor: theme.primaryBackgroundColor, paddingTop: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={[
              styles.channelName,
              channel.titleColor ? {color: channel.titleColor} : {},
            ]}>
            {`@${channelName}`}
          </Text>
          {channel.unreadMessagesCount > 0 && (
            <View style={styles.unreadMessages}>
              <Text style={styles.unreadText}>
                {channel.unreadMessagesCount}
              </Text>
            </View>
          )}
        </View>
        {lastPost && (
          <Post
            postId={lastPost.id}
            userId={lastPost.user ? lastPost.user.id : ''}
            last_picture_update={lastPost.user.last_picture_update}
            key={lastPost.id}
            message={lastPost.message}
            username={lastPost.user ? lastPost.user.username : ''}
            metadata={lastPost.metadata}
            createdAt={lastPost.create_at}
            edit_at={lastPost.edit_at}
            type={lastPost.type}
            isPM
            disableInteractions
            extendedDateFormat
            disableDots
          />
        )}
        <Separator />
      </TouchableOpacity>
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
        <Image source={SATELLITE} />
        <Text style={[styles.emptyText, {color: theme.placeholderTextColor}]}>
          Your inbox is empty. It's time to send your first direct message.
        </Text>
      </View>
    );
  };

  render() {
    const {privateChanels} = this.props;
    const allPosts = privateChanels.map(channel => channel.posts);
    const {theme} = this.props;
    return (
      <FlatList
        data={privateChanels}
        keyExtractor={item => item.id}
        style={[
          styles.listContainer,
          {backgroundColor: theme.secondaryBackgroundColor},
        ]}
        renderItem={this.renderItem}
        ListEmptyComponent={this.renderEmptyList}
        extraData={allPosts}
      />
    );
  }
}

const mapDispatchToProps = {
  setActiveFocusChannel,
};

const mapStateToProps = state => ({
  privateChanels: getPrivateMessagesChnnelsList(state, 'D'),
  theme: state.themes[state.themes.current],
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivateMessages);
