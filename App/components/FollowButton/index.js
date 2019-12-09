import React, {useCallback} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setFollow, setUnfollow} from '../../actions/follow';
import styles from './styles';

const FollowButton = ({userId, isFollowing}) => {
  const dispatch = useDispatch();

  const loadingFollowChange = useSelector(
    state => state.loggedUserFollow.loadingChange,
  );

  const theme = useSelector(state => state.themes[state.themes.current]);

  const handleFollow = useCallback(() => {
    dispatch(setFollow(userId));
  }, [dispatch, userId]);

  const handleUnfollow = useCallback(() => {
    dispatch(setUnfollow(userId));
  }, [dispatch, userId]);
  return (
    <TouchableOpacity
      style={[
        styles.followContainer,
        isFollowing ? styles.unfollow : styles.follow,
      ]}
      onPress={isFollowing ? handleUnfollow : handleFollow}
      disabled={loadingFollowChange}>
      <Text
        style={[
          styles.followButtonText,
          isFollowing
            ? {...styles.unfollowText, color: theme.primaryBackgroundColor}
            : styles.followText,
        ]}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Text>
    </TouchableOpacity>
  );
};

export default FollowButton;
