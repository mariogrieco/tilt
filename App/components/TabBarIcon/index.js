import React from 'react';
import {Image, View} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {connect} from 'react-redux';
import assets from '../ThemeWrapper/assets';
import {
  notifyMessageIconForPrivateTab,
  notifyMessageIconForPublicTab,
} from '../../selectors/tabsNotification';

const styles = StyleSheet.create({
  dotNotification: {
    position: 'absolute',
    top: '-8%',
    right: '-3%',
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 9999,
  },
});

const TabBarIcon = ({
  routeName,
  focused,
  themeName,
  theme,
  hasUnreadPrivateMessage,
  hasUnreadPublicMessage,
}) => {
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
        <View style={{position: 'relative'}}>
          {hasUnreadPublicMessage && (
            <View
              style={[styles.dotNotification, {backgroundColor: theme.tiltRed}]}
            />
          )}
          <Image
            source={
              assets[themeName][`PUBLIC_CHAT_${focused ? 'FOCUS' : 'UNFOCUS'}`]
            }
          />
        </View>
      );
    case 'Messages':
      return (
        <View style={{position: 'relative'}}>
          {hasUnreadPrivateMessage && (
            <View
              style={[styles.dotNotification, {backgroundColor: theme.tiltRed}]}
            />
          )}
          <Image
            source={
              assets[themeName][`MESSAGES_${focused ? 'FOCUS' : 'UNFOCUS'}`]
            }
          />
        </View>
      );
    case 'Profile':
      return (
        <Image
          source={assets[themeName][`PROFILE_${focused ? 'FOCUS' : 'UNFOCUS'}`]}
        />
      );
  }
};

const mapStateToProps = state => ({
  themeName: state.themes.current,
  theme: state.themes[state.themes.current],
  hasUnreadPrivateMessage: notifyMessageIconForPrivateTab(state),
  hasUnreadPublicMessage: notifyMessageIconForPublicTab(state),
});

export default connect(mapStateToProps)(TabBarIcon);
