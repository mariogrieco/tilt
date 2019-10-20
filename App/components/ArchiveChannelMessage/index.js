import React from 'react';
import {
  View,
  Text
} from 'react-native';
import isEqual from 'lodash/isEqual';
import styles from './styles';

class ArchiveChannelMessage extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textInfo}>
            Your are viewing an archived channel. New messages cannot be posted.
          </Text>
        </View>
        <Text style={styles.button} onPress={this.props.redirectToChannels}>Close Channel</Text>
      </View>
    );
  }
}

export default ArchiveChannelMessage;
