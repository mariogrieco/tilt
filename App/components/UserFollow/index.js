import React, {useCallback} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {createSelector} from 'reselect';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import {setFollow, setUnfollow} from '../../actions/follow';

const userSelector = (state, props) => state.users.data[props.userId] || {};
const followingUsers = state => state.loggedUserFollow.following;

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
  const dispatch = useDispatch();

  const getUserWithFollowState = useCallback(() => {
    const getUser = makeUserWithFollowState();
    return state => getUser(state, {userId});
  }, [userId]);

  const handleFollow = useCallback(() => {
    dispatch(setFollow(userId));
  }, [dispatch, userId]);

  const handleUnfollow = useCallback(() => {
    dispatch(setUnfollow(userId));
  }, [dispatch, userId]);

  const user = useSelector(getUserWithFollowState());

  const loggedUserId = useSelector(state =>
    state.login.user ? state.login.user.id : '',
  );

  const loadingFollowChange = useSelector(
    state => state.loggedUserFollow.loadingChange,
  );

  const pictureUrl = getUserProfilePicture(user.id, user.last_picture_update);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={{uri: pictureUrl}} style={styles.userPicture} />
        <View>
          <Text style={styles.userNames}>{`${user.name || ''} ${
            user.last_name
          }`}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
        <View style={styles.followSection}>
          {loggedUserId !== user.id && (
            <TouchableOpacity
              style={[
                styles.followContainer,
                user.isFollowed ? styles.unfollow : styles.follow,
              ]}
              onPress={user.isFollowed ? handleUnfollow : handleFollow}
              disabled={loadingFollowChange}>
              <Text
                style={[
                  styles.followButtonText,
                  user.isFollowed ? styles.unfollowText : styles.followText,
                ]}>
                {user.isFollowed ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={styles.userBio}>{user.position}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 13.5,
    paddingBottom: 15.5,
  },
  followSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  followContainer: {
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#17c491',
  },
  follow: {
    backgroundColor: 'transparent',
  },
  unfollow: {
    backgroundColor: '#17c491',
  },
  followButtonText: {
    fontFamily: 'SFProDisplay-Medium',
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
  userBio: {
    marginTop: 12,
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    color: '#1c2431',
  },
});

export default UserFollow;
