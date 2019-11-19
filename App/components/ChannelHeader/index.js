import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Text, View, Image} from 'react-native';
import moment from 'moment';

import styles from './styles';

// const EARTH = require('../../../assets/themes/light/earth/earth.png');
const NEW = require('../../../assets/themes/light/new/new.png');
const GOAT = require('../../../assets/themes/light/goat/goat.png');
const STAR = require('../../../assets/themes/light/star/star.png');
const CHANNEL_ROCKET = require('../../../assets/themes/light/channelRocket/channelRocket.png');
const FIRE = require('../../../assets/themes/light/fire/fire.png');

class ChannelHeader extends PureComponent {
  render() {
    const {
      name,
      create_at,
      members,
      fav,
      pm,
      isAdminCreator,
      theme,
    } = this.props;
    const diff = moment(create_at).diff(moment(), 'days') >= -3;
    return (
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.text,
            {color: theme.primaryTextColor},
            isAdminCreator ? {textTransform: 'uppercase'} : {},
          ]}>
          {!pm ? `${isAdminCreator ? '$' : '#'} ${name}` : `@${name}`}
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

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(mapStateToProps)(ChannelHeader);
