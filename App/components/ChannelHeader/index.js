import React, {PureComponent} from 'react';
import {Text, View, Image} from 'react-native';
import moment from 'moment';

import styles from './styles';

// const EARTH = require('../../../assets/images/earth/earth.png');
const NEW = require('../../../assets/images/new/new.png');
const GOAT = require('../../../assets/images/goat/goat.png');
const STAR = require('../../../assets/images/star/star.png');
const CHANNEL_ROCKET = require('../../../assets/images/channelRocket/channelRocket.png');
const FIRE = require('../../../assets/images/fire/fire.png');

export default class ChannelHeader extends PureComponent {
  render() {
    const {
      name,
      create_at,
      members,
      fav,
      pm,
      isAdminCreator,
    } = this.props;
    const diff = moment(create_at).diff(moment(), 'days') >= -3;
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.text}>
          {!pm
            ? `${isAdminCreator ? '$' : '#'} ${name}`
            : `@${name}`}
          {'  '}
        </Text>
        {!pm && (
          <View style={styles.icon}>
            {diff && <Image source={NEW} />}
            {!diff && members > 10000 && <Image source={FIRE} />}
            {!diff && members > 100000 && <Image source={CHANNEL_ROCKET} />}
            {!diff && members > 1000000 && <Image source={GOAT} />}
            {fav && <Image source={STAR} />}
          </View>
        )}
      </View>
    );
  }
}
