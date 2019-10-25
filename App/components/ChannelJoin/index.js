import React, {Fragment} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';

export default function ChannelJoin({
  titleColor,
  members,
  postsLength,
  // figure,
  title,
  // userStatus,
  shortTitle,
  onPress,
  onJoin,
  // figure_id
}) {
  const postLabel = postsLength > 1 || postsLength === 0 ? 'posts' : 'post';
  const memberLabel = members > 1 || members === 0 ? 'members' : 'member';
  return (
    <Fragment>
      {!shortTitle ? (
        <View style={styles.container}>
          <View>
            <Text style={[styles.title, styles[titleColor]]}>{title}</Text>
            <Text style={styles.span}>{`${members} ${memberLabel}`}</Text>
            <Text style={styles.span}>{`${postsLength} ${postLabel}`}</Text>
          </View>
          {/* <Picture
              source={{ uri: `${getBaseUrl()}/api/v4/users/${figure_id}/image` }}
              userStatus={userStatus}
            /> */}
          <TouchableOpacity
            activeOpacity={1}
            style={styles.join}
            onPress={onJoin}>
            <Text style={styles.joinText}>Join</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.shortContainer}
          onPress={onPress}>
          <Text style={[styles.shortTitle, styles[titleColor]]}>{title}</Text>
        </TouchableOpacity>
      )}
    </Fragment>
  );
}
