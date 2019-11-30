import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import Client4 from '../../api/MattermostClient';
import getFollows from '../../actions/follow';

const FollowSummary = ({navigation, userId}) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const loggedUserId = useSelector(state =>
    state.login.user ? state.login.user.id : '',
  );
  const dispatch = useDispatch();

  const handleFollowing = useCallback(() => {
    navigation.navigate('Follow', {
      activeTab: 0,
      followers,
      following,
    });
  }, [followers, following, navigation]);

  const handleFollowers = useCallback(() => {
    navigation.navigate('Follow', {
      activeTab: 1,
      followers,
      following,
    });
  }, [followers, following, navigation]);

  useEffect(() => {
    dispatch(getFollows(loggedUserId));
  }, [dispatch, loggedUserId]);

  useEffect(() => {
    const getFollowersAndFollowing = async () => {
      try {
        const [dataFollowers, dataFollowing] = await Promise.all([
          Client4.getUserFollowers(userId),
          Client4.getUserFollowings(userId),
        ]);
        setFollowers(dataFollowers);
        setFollowing(dataFollowing);
      } catch (err) {
        console.log(err);
      }
    };

    getFollowersAndFollowing();
  }, [userId]);

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
