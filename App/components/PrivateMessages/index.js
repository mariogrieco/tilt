import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import getPrivateMessagesChnnelsList from '../../selectors/getPrivateMessagesChnnelsList';
import Post from '../Post/Post';
import NavigationService from '../../config/NavigationService';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import styles from './styles';
import parser from '../../utils/parse_display_name';
import Separator from '../Separator';

class PrivateMessages extends React.Component {
  parseDisplayName(str = '') {
    return parser(str);
  }

  renderItem = ({item: channel}) => {
    const lastPost = channel.posts[0];
    const channelName = this.parseDisplayName(channel.display_name);
    return (
      <View style={{backgroundColor: '#fff'}}>
        <TouchableOpacity
          activeOpacity={1}
          key={channel.id}
          onPress={() => {
            this.props.setActiveFocusChannel(channel.id);
            NavigationService.navigate('Channel', {
              display_name: channelName,
              create_at: channel.create_at,
              members: channel.members,
              fav: channel.fav,
              pm: true,
            });
          }}>
          <Text style={styles.channelName}>{`@${channelName}`}</Text>
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
      </View>
    );
  };

  render() {
    const {privateChanels} = this.props;

    const allPosts = privateChanels.map(channel => channel.posts);

    return (
      <FlatList
        data={privateChanels}
        keyExtractor={item => item.id}
        style={styles.listContainer}
        renderItem={this.renderItem}
        extraData={allPosts}
        keyboardDismissMode="on-drag"
      />
    );
  }
}

const mapDispatchToProps = {
  setActiveFocusChannel,
};

const mapStateToProps = state => ({
  privateChanels: getPrivateMessagesChnnelsList(state, 'D'),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivateMessages);
