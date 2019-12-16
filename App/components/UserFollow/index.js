import React, {useCallback} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {createSelector} from 'reselect';
import FollowButton from '../FollowButton';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import {setCurrentDisplayUserProfile} from '../../actions/users';
import NavigationService from '../../config/NavigationService';

const userSelector = (state, props) => state.users.data[props.userId] || {};
const followingUsers = state => state.loggedUserFollow.following;

const makeUserWithFollowState = () =>
  createSelector([userSelector, followingUsers], (user, following) => {
    const result = following.find(userId => userId === user.id);
    user.isFollowed = Boolean(result);
    return user;
  });

const UserFollow = ({userId}) => {
  const dispatch = useDispatch();
  const getUserWithFollowState = useCallback(() => {
    const getUser = makeUserWithFollowState();
    return state => getUser(state, {userId});
  }, [userId]);

  const user = useSelector(getUserWithFollowState());

  const loggedUserId = useSelector(state =>
    state.login.user ? state.login.user.id : '',
  );

  const navigateToProfile = useCallback(() => {
    dispatch(setCurrentDisplayUserProfile(user.id));
    if (user.id === loggedUserId) {
      NavigationService.navigate('LoggedIn');
    } else {
      NavigationService.navigate('MemberProfile');
    }
  }, [user.id, loggedUserId, dispatch]);

  const theme = useSelector(state => state.themes[state.themes.current]);

  const pictureUrl = getUserProfilePicture(user.id, user.last_picture_update);

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={{flex: 1, flexDirection: 'row'}}
          onPress={navigateToProfile}>
          <Image source={{uri: pictureUrl}} style={styles.userPicture} />
          <View>
            <Text
              style={[
                styles.userNames,
                {color: theme.primaryTextColor},
              ]}>{`${user.first_name || ''} ${user.last_name}`}</Text>
            <Text style={styles.username}>@{user.username}</Text>
          </View>
        </TouchableOpacity>
        <View>
          {loggedUserId !== user.id && (
            <FollowButton userId={user.id} isFollowing={user.isFollowed} />
          )}
        </View>
      </View>
      <TouchableOpacity onPress={navigateToProfile}>
        <Text style={[styles.userBio, {color: theme.primaryTextColor}]}>
          {user.position}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 13.5,
    paddingBottom: 15.5,
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
