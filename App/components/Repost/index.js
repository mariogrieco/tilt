import React, {PureComponent} from 'react';
import {View} from 'react-native';
import Post from '../Post/Post';

import styles from './styles';
import {connect} from 'react-redux';

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
      deleteAction,
    } = this.props;
    const {theme} = this.props;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.repostSeparator,
            {backgroundColor: theme.threadSeparatorColor},
          ]}
        />
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
          deleteAction={deleteAction}
          styles={styles.repost}
          extendedDateFormat
        />
      </View>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(Repost);
