import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import Post from '../Post/Post';
import styles from './styles';

const PostPreview = ({
  id,
  postUserId,
  message,
  metada,
  createdAt,
  editedAt,
  type,
  postedChannelName,
}) => {
  const user = useSelector(state => state.users.data[postUserId]);
  return (
    <View style={styles.container}>
      <Post
        postId={id}
        userId={postUserId}
        last_picture_update={user.last_picture_update}
        message={message}
        metadata={metada}
        createdAt={createdAt}
        edit_at={editedAt}
        type={type}
        username={user.username}
        disableInteractions
        extendedDateFormat
        postedChannelName={postedChannelName}
      />
    </View>
  );
};

export default PostPreview;
