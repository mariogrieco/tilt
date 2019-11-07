import React from 'react';
import {View, Text} from 'react-native';
import NavigationService from '../../config/NavigationService';
import styles from './style';

const Terms = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        By signing up, you agree to our
        <Text
          onPress={() => {
            NavigationService.navigate('TermsWeb');
          }}
          style={styles.focusText}>
          {' '}
          Terms and Conditions
        </Text>
      </Text>
    </View>
  );
};

export default Terms;
