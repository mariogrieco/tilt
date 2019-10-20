import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import styles from './styles';

const JOIN_CHAT = require('../../../assets/images/join-chat/rocket.png');

const JoinBigBtn = ({
  onJoin
}) => {
  return (
    <View style={styles.container}>
      <Image source={JOIN_CHAT} />
      {/*<Text style={styles.spanText}>Join the chat</Text>*/}
      <TouchableOpacity style={styles.btn} onPress={onJoin}>
        <Text style={styles.textBtn}>
          Join the chat
        </Text>
      </TouchableOpacity>
    </View>
  )
};

export default JoinBigBtn;
