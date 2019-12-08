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
// import parser from '../../utils/parse_display_name';

export class SearchResults extends PureComponent {
  keyExtractor(item) {
    return item.id;
  }

  navegateIfExists(id) {
    return () => {
      this.props.navigateIfExists(null, id);
    };
  }

  getChannelDisplayItem = item => {
    const name = item.channel ? item.channel.show_name : '';
    const id = item.channel ? item.channel.id : '';
    return (
      <TouchableOpacity onPress={this.navegateIfExists(id)}>
        <Text style={styles.channelTitle}>
          {item.pm ? '@' : item.isDollar ? '$' : '#'}
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  renderItem = ({item}) => {
    const {theme} = this.props;
    return (
      <View style={{backgroundColor: theme.primaryBackgroundColor}}>
        <View style={[styles.channelTitleContainer, {paddingTop: 10}]}>
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
          edit_at={item.edit_at}
          type={item.type}
          disableDots
          jumpTo
          extendedDateFormat
          post_props={item.props}
        />
        <BottomBlockSpaceSmall />
      </View>
    );
  };

  renderLoading = () => {
    if (!this.props.loading) {
      return (
        <View>
          <Text />
        </View>
      );
    }
    return <ActivityIndicator size="large" color="#17C491" />;
  };

  render() {
    const {theme} = this.props;
    const {posts, loading} = this.props;
    return (
      <View
        style={[
          styles.container,
          {borderBottomColor: theme.borderBottomColor},
        ]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.secondaryBackgroundColor,
              borderTopColor: theme.borderBottomColor,
            },
          ]}>
          <Text style={[styles.title, {color: theme.primaryTextColor}]}>
            Search Results
          </Text>
        </View>
        <ScrollView
          keyboardDismissMode="on-drag"
          style={[
            styles.body,
            {backgroundColor: theme.secondaryBackgroundColor},
          ]}>
          <Separator />
          <FlatList
            data={loading ? [] : posts}
            extraData={loading ? [] : posts}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderLoading}
          />
        </ScrollView>
      </View>
    );
  }
}
const mapDispatchToProps = {
  navigateIfExists,
};

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
