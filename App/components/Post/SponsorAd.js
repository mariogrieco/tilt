import React from 'react';
import {Text, View} from 'react-native';
import {SponsorBanner} from '../AdBanner';

import styles from './style';

const SponsorAd = () => {
  return (
    <View>
      <Text style={[styles.text, {marginBottom: 10}]}>
        A message form our sponsors.
      </Text>
      <SponsorBanner />
    </View>
  );
};

export default React.memo(SponsorAd);
