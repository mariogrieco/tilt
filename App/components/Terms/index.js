import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import styles from './style';

const Terms = ({onTerms}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        By signing up, you agree to our
        <Text onPress={onTerms} style={styles.focusText}>
          Terms and Conditions
        </Text>
      </Text>
    </View>
  );
};

export default Terms;
