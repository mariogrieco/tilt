import React, {useCallback} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';

const userSelector = (state, props) => state.users.data[props.userId] || {};
const followingUsers = state => state.follow.following;

const makeUserWithFollowState = () =>
  createSelector(
    [userSelector, followingUsers],
    (user, following) => {
      const result = following.find(userId => userId === user.id);
      user.isFollowed = Boolean(result);
      return user;
    },
  );

const UserFollow = ({userId}) => {
  const getUserWithFollowState = useCallback(() => {
    const getUser = makeUserWithFollowState();
    return state => getUser(state, {userId});
  }, [userId]);

  const user = useSelector(getUserWithFollowState());
  const pictureUrl = getUserProfilePicture(user.id, user.last_picture_update);

  return (
    <View style={styles.container}>
      <Image source={{uri: pictureUrl}} style={styles.userPicture} />
      <View>
        <Text style={styles.userNames}>{`${user.name || ''} ${
          user.last_name
        }`}</Text>
        <Text style={styles.username}>@{user.username}</Text>
      </View>
      <View style={styles.followSection}>
        <TouchableOpacity
          style={[
            styles.followContainer,
            user.isFollowed ? styles.follow : styles.unfollow,
          ]}>
          <Text
            style={[
              styles.followButtonText,
              user.isFollowed ? styles.followText : styles.unfollowText,
            ]}>
            {user.isFollowed ? 'Follow' : 'Unfollow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 13.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  followSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  followContainer: {
    width: 80,
    height: 30,
    paddingTop: 6,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16.5,
    borderWidth: 1.5,
    borderColor: '#17c491',
  },
  follow: {
    backgroundColor: '#FFF',
  },
  unfollow: {
    backgroundColor: '#17c491',
  },
  followButtonText: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  followText: {
    color: '#17c491',
  },
  unfollowText: {
    color: '#FFF',
  },
  userNames: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Bold',
    color: '#0e141e',
  },
  username: {
    color: '#585c63',
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
  },
  userPicture: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginRight: 10,
  },
});

export default UserFollow;
