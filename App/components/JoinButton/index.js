import React, {useCallback} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {addToChannel} from '../../actions/channels';
import styles from './styles';

const JoinButton = ({
  channelId,
  buttonStyle = {},
  textStyle = {},
  displayText = 'JOIN',
}) => {
  const loggedUserId = useSelector(state =>
    state.login.user ? state.login.user.id : '',
  );
  const theme = useSelector(state => state.themes[state.themes.current]);
  const dispatch = useDispatch();

  const joinInChannel = useCallback(() => {
    dispatch(addToChannel(loggedUserId, channelId))
      .then(() => console.log('Ok Join'))
      .catch(err => console.log(err));
  }, [loggedUserId, channelId, dispatch]);

  return (
    <TouchableOpacity
      style={[
        styles.joinButton,
        buttonStyle,
        {backgroundColor: theme.tiltGreen},
      ]}
      onPress={joinInChannel}>
      <Text
        style={[
          styles.joinText,
          textStyle,
          {color: theme.primaryBackgroundColor},
        ]}>
        {displayText}
      </Text>
    </TouchableOpacity>
  );
};

export default JoinButton;
