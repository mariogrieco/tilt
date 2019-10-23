import React from 'react';
import {Text, View} from 'react-native';
import {SponsoredBanner} from '../AdBanner';

import styles from './style';

const SponsoredAd = () => {
  return (
    <View>
      <Text style={[styles.text, {marginBottom: 10}]}>
        A message form our sponsors.
      </Text>
      <SponsoredBanner />
    </View>
  );
};

export default React.memo(SponsoredAd);
