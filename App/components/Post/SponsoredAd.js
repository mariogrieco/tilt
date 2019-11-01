import React from 'react';
import {Text, View} from 'react-native';
import {SponsoredBanner} from '../AdBanner';

import styles from './style';

const SponsoredAd = ({
  isRepost,
}) => {
  return (
    <View>
      <Text style={[styles.text, {marginBottom: 10}]}>
        A message form our sponsors.
      </Text>
      <SponsoredBanner isRepost={isRepost} />
    </View>
  );
};

export default React.memo(SponsoredAd);
