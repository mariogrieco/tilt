import React from 'react';
import {useSelector} from 'react-redux';
import Post from '../Post/Post';

const PostPreview = ({
  id,
  postUserId,
  message,
  metada,
  createdAt,
  editedAt,
  type,
}) => {
  const user = useSelector(state => state.users.data[postUserId]);
  return (
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
      disableDots
    />
  );
};

export default PostPreview;
