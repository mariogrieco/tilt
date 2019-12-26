import React from 'react';
import {useSelector} from 'react-redux';
import {View, Text} from 'react-native';

import styles from './styles';

const ConnectionLabel = () => {
  const state = useSelector(_state => {
    return {
      socketStatus: _state.socketStatus,
      theme: _state.themes,
    };
  });

  const {conecting, reconecting, error, connected} = state.socketStatus;
  const {secondaryBackgroundColor, primaryTextColor} = state.theme;

  if (conecting || reconecting) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: secondaryBackgroundColor,
          },
        ]}>
        <Text
          style={{
            color: primaryTextColor,
          }}>
          Connection lost. Reconnecting…
        </Text>
      </View>
    );
  }

  if (!connected || error) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: secondaryBackgroundColor,
          },
        ]}>
        <Text
          style={{
            color: primaryTextColor,
          }}>
          Connection lost.
        </Text>
      </View>
    );
  }

  return null;
};

export default ConnectionLabel;
