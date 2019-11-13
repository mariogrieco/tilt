import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';

import styles from './styles';
import {connect} from 'react-redux';

const JOIN_CHAT = require('../../../assets/themes/light/join-chat/rocket.png');

const JoinBigBtn = ({onJoin, theme}) => {
  return (
    <View style={styles.container}>
      <Image source={JOIN_CHAT} />
      {/*<Text style={styles.spanText}>Join the chat</Text>*/}
      <TouchableOpacity style={styles.btn} onPress={onJoin}>
        <Text style={[styles.textBtn, {color: theme.buttonTextColor}]}>
          Join the chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = ({themes}) => ({
  theme: themes[themes.current],
});
export default connect(mapStateToProps)(JoinBigBtn);
