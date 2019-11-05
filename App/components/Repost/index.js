import React, {PureComponent} from 'react';
import {View} from 'react-native';
import Post from '../Post/Post';

import styles from './styles';

export class Repost extends PureComponent {
  render() {
    const {
      postId,
      message,
      metadata,
      create_at,
      replies,
      edit_at,
      type,
      userId,
      last_picture_update,
      username,
      onPress,
    } = this.props;
    return (
      <View style={styles.container} onPress={onPress}>
        <Post
          postId={postId}
          userId={userId}
          last_picture_update={last_picture_update}
          message={message}
          username={username}
          metadata={metadata}
          createdAt={create_at}
          replies={replies}
          edit_at={edit_at}
          type={type}
          isPM={false}
          isRepost
          styles={styles.repost}
        />
      </View>
    );
  }
}

export default Repost;
