import React, {useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import {getMyFollows, getFollowsForFocusUser} from '../../actions/follow';

const FollowSummary = ({navigation, userId}) => {
  const loggedUserId = useSelector(state =>
    state.login.user ? state.login.user.id : '',
  );
  const user = useSelector(state => state.users.data[userId]);
  const {following, followers} = useSelector(state => {
    return state.login.user.id === userId
      ? state.loggedUserFollow
      : state.currentFollowUserData;
  });
  const dispatch = useDispatch();

  const handleFollowing = useCallback(() => {
    navigation.navigate('Follow', {
      activeTab: 0,
      title: `@${user.username}`,
    });
  }, [navigation, user.username]);

  const handleFollowers = useCallback(() => {
    navigation.navigate('Follow', {
      activeTab: 1,
      title: `@${user.username}`,
    });
  }, [navigation, user.username]);

  useEffect(() => {
    if (user.id === loggedUserId) {
      dispatch(getMyFollows());
    } else {
      dispatch(getFollowsForFocusUser());
    }
  }, [dispatch, loggedUserId, user.id]);

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      if (user.id === loggedUserId) {
        dispatch(getMyFollows());
      } else {
        dispatch(getFollowsForFocusUser());
      }
    });

    return () => focusListener.remove();
  }, [dispatch, loggedUserId, navigation, user.id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, {marginRight: 15}]}
        onPress={handleFollowing}>
        <Text style={styles.usersCountText}>{following.length}</Text>
        <Text style={styles.buttonLabelText}>Following</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleFollowers}>
        <Text style={styles.usersCountText}>{followers.length}</Text>
        <Text style={styles.buttonLabelText}>Followers</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usersCountText: {
    paddingRight: 5,
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 14,
  },
  buttonLabelText: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    color: '#585c63',
  },
});

export default withNavigation(FollowSummary);
