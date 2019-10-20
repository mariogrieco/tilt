import React, {PureComponent} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';

import styles from './styles';

export default class UserMentionPreview extends PureComponent {
  handleOnPress = () => {
    const {username} = this.props;
    this.props.onMention(`${username}`);
  };

  render() {
    const {id, last_picture_update, username} = this.props;
    return (
      <TouchableHighlight underlayColor="#17C491" onPress={this.handleOnPress}>
        <View style={styles.mentions}>
          <Image
            style={styles.mentionsProfileImage}
            source={{uri: getUserProfilePicture(id, last_picture_update)}}
          />
          <Text style={[styles.commandContainer, styles.mentionsColor]}>
            {'@'}
            {username}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}
