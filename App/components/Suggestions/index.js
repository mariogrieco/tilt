import React, {PureComponent} from 'react';
import {Text, View, FlatList, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import UserMentionPreview from '../UserMentionPreview';
import Separator from '../Separator';

import styles from './styles';
class Suggestions extends PureComponent {
  renderChannelItem = item => {
    const {theme} = this.props;
    return (
      <TouchableHighlight
        underlayColor="#17C491"
        onPress={() => {
          this.props.onChannel(item.show_name);
        }}
        style={styles.channelName}>
        <Text style={[styles.channelText, {color: theme.primaryTextColor}]}>
          {item.pm ? '@' : item.isDollar ? '$' : '#'}
          {item.show_name}
        </Text>
      </TouchableHighlight>
    );
  };

  renderMentionItem = item => (
    <UserMentionPreview
      username={item.username}
      id={item.id}
      last_picture_update={item.last_picture_update}
      onMention={this.props.onMention}
    />
  );

  renderItem = ({item}) => {
    const {channel} = this.props;
    return channel
      ? this.renderChannelItem(item)
      : this.renderMentionItem(item);
  };

  keyExtractor(item) {
    return item.id;
  }

  renderSeparator() {
    return <Separator />;
  }

  renderHeader = () => {
    const {headerLabel, theme} = this.props;
    return (
      <View
        style={[styles.body, {backgroundColor: theme.primaryBackgroundColor}]}>
        <View
          style={[
            styles.header,
            {backgroundColor: theme.secondaryBackgroundColor},
          ]}>
          <Text style={[styles.title, {color: theme.primaryTextColor}]}>
            {headerLabel}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    const {data, theme} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          style={[{flex: 1}, {backgroundColor: theme.primaryBackgroundColor}]}
          data={data}
          renderItem={this.renderItem}
          renderSeparator={this.renderSeparator}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(Suggestions);
