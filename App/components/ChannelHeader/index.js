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
  renderImage(members) {
    switch (members) {
      case members > 10000:
        return <Image source={FIRE} />;
      case members > 100000:
        return <Image source={CHANNEL_ROCKET} />;
      case members > 1000000:
        return <Image source={GOAT} />;
      default:
        return <View />;
    }
  }

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
            // eslint-disable-next-line react-native/no-inline-styles
            isAdminCreator ? {textTransform: 'uppercase'} : {},
          ]}>
          {!pm ? `${isAdminCreator ? '$' : '#'} ${name}` : `@${name}`}
          {'  '}
        </Text>
        {!pm && (
          <View style={styles.icon}>
            {diff ? <Image source={NEW} /> : this.renderImage(members)}
            {!!fav && <Image source={STAR} />}
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(mapStateToProps)(ChannelHeader);
