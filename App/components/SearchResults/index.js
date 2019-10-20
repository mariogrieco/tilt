import React, {PureComponent} from 'react';
import {
  Text,
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {navigateIfExists} from '../../actions/channels';
import Post from '../Post/Post';

import styles from './styles';
import BottomBlockSpaceSmall from '../BottomBlockSpaceSmall';
import Separator from '../Separator';
import parser from '../../utils/parse_display_name';

export class SearchResults extends PureComponent {
  keyExtractor(item) {
    return item.id;
  }

  navegateIfExists(displayName) {
    return () => {
      this.props.navigateIfExists(`#${displayName}`);
    };
  }

  getChannelDisplayItem = item => {
    const name = item.channel ? this.parseName(item.channel.display_name) : '';
    return (
      <TouchableOpacity onPress={this.navegateIfExists(name)}>
        <Text style={styles.channelTitle}>
          {item.isDollar ? '$' : '#'}
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  parseName(name = '') {
    return parser(name);
  }

  renderItem = ({item}) => (
    <View style={{backgroundColor: '#fff'}}>
      <View style={[styles.channelTitleContainer, {paddingTop: 10}]}>
        {/* <SeparatorContainer noPadding createdAt={item.create_at} /> */}
        {this.getChannelDisplayItem(item)}
      </View>
      <Post
        postId={item.id}
        metadata={item.metadata}
        userId={item.user_id}
        last_picture_update={item.user ? item.user.last_picture_update : ''}
        message={item.message}
        username={item.user ? item.user.username : ''}
        channel={item.channel}
        createdAt={item.create_at}
        // replies={item.replies}
        edit_at={item.edit_at}
        // channelsNames={this.props.channelsNames}
        // usernames={this.props.usernames}
        type={item.type}
        disableDots
        jumpTo
        extendedDateFormat
      />
      <BottomBlockSpaceSmall />
    </View>
  );

  renderLoading = () => {
    if (!this.props.loading)
      return (
        <View>
          <Text />
        </View>
      );
    return <ActivityIndicator size="large" color="#17C491" />;
  };

  render() {
    const {posts, loading} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Results</Text>
        </View>
        <ScrollView keyboardDismissMode="on-drag" style={styles.body}>
          <Separator />
          <FlatList
            data={loading ? [] : posts}
            extraData={loading ? [] : posts}
            // inverted
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderLoading}
            keyboardDismissMode="on-drag"
          />
          {/* {loading && <ActivityIndicator size="large" color="rgba(63, 184, 127, 1)" />} */}
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = {
  navigateIfExists,
};

export default connect(
  null,
  mapDispatchToProps,
)(SearchResults);
