import React from 'react';
import {Image} from 'react-native';
import {connect} from 'react-redux';
import assets from '../ThemeWrapper/assets';

const TabBarIcon = ({routeName, focused, themeName}) => {
  console.log(routeName);
  switch (routeName) {
    case 'Watchlist':
      return (
        <Image
          source={
            assets[themeName][`WATCHLIST_${focused ? 'FOCUS' : 'UNFOCUS'}`]
          }
        />
      );
    case 'Chat':
      return (
        <Image
          source={
            assets[themeName][`PUBLIC_CHAT_${focused ? 'FOCUS' : 'UNFOCUS'}`]
          }
        />
      );
    case 'Messages':
      return (
        <Image
          source={
            assets[themeName][`MESSAGES_${focused ? 'FOCUS' : 'UNFOCUS'}`]
          }
        />
      );
    case 'Profile':
      return (
        <Image
          source={assets[themeName][`PROFILE_${focused ? 'FOCUS' : 'UNFOCUS'}`]}
        />
      );
  }
};

const mapStateToProps = ({themes}) => ({themeName: themes.current});

export default connect(mapStateToProps)(TabBarIcon);
