import React, {useCallback} from 'react';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {createSelector} from 'reselect';

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

  return (
    <View>
      <Text>{user.id}</Text>
      <Text>{user.username}</Text>
      {user.isFollowed && <Text>Following</Text>}
    </View>
  );
};

export default UserFollow;
