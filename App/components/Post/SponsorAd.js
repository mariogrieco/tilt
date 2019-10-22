import React from 'react';
import {Text, View} from 'react-native';
import {SponsoredBanner} from '../AdBanner';

import styles from './style';

export default class SponsorAd extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <View>
        <Text style={[styles.text, {marginBottom: 10}]}>
          A message form our sponsors.
        </Text>
        <SponsoredBanner />
      </View>
    );
  }
}
