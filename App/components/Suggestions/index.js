import React, {PureComponent} from 'react';
import {Text, View, FlatList, TouchableHighlight} from 'react-native';
import UserMentionPreview from '../UserMentionPreview';
import Separator from '../Separator';

import styles from './styles';

export default class index extends PureComponent {
  renderChannelItem = item => (
    <TouchableHighlight
      underlayColor="#17C491"
      onPress={() => {
        this.props.onChannel(item.show_name);
      }}
      style={styles.channelName}>
      <Text style={styles.channelText}>
        {item.pm ? '@' : item.isDollar ? '$' : '#'}
        {item.show_name}
      </Text>
    </TouchableHighlight>
  );

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

  renderHeader() {
    const {headerLabel} = this.props;
    return (
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>{headerLabel}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {data} = this.props;
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <FlatList
          style={{flex: 1}}
          data={data}
          renderItem={this.renderItem}
          renderSeparator={this.renderSeparator}
          keyExtractor={this.keyExtractor}
        />
      </View>
    );
  }
}
