import React from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {SponsoredBanner} from '../AdBanner';

import styles from './style';

const SponsoredAd = ({isRepost, theme}) => {
  return (
    <View>
      <Text
        style={[
          styles.text,
          {marginBottom: 10, color: theme.primaryTextColor},
        ]}>
        A message form our sponsors.
      </Text>
      <SponsoredBanner isRepost={isRepost} />
    </View>
  );
};

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(SponsoredAd);
