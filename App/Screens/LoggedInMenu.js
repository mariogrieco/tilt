import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  View,
  Switch,
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import StyleSheet from 'react-native-extended-stylesheet';
import DeviceInfo from 'react-native-device-info';
import GoBack from '../components/GoBack';
import {isLogin, logout} from '../actions/login';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
import {changeTheme} from '../actions/themeManager';
import {
  enableGlobalNotifications,
  disableGlobalNotifications,
} from '../actions/users';

const EDIT = require('../../assets/images/tune-black/tune.png');
const INVITE_PEOPLE = require('../../assets/images/add-friend-black/add-friend.png');
// const NOTIFICATIONS = require('../../assets/images/bell-black/002-bell.png');
const SUPPORT = require('../../assets/images/support/support.png');
const BLOCKED_GREEN = require('../../assets/images/block-user-green/block-user-green.png');
const BELL = require('../../assets/images/bell-black/002-bell.png');
const MOON = require('../../assets/images/moon/night.png');

const styles = StyleSheet.create({
  row: {
    height: 44,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  blockedContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 0,
    margin: 0,
    // width: '100%',
  },
  button: {},
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
  },
  logoutText: {
    fontFamily: 'SFProDisplay-Medium',
  },
  icon: {
    marginRight: 15,
  },
});

class LoggedInMenu extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Menu',
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
    ...headerForScreenWithBottomLine({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
  });

  handleLogout = () => {
    const {dispatchLogout, dispatchIsLogin, navigation} = this.props;
    dispatchLogout();
    dispatchIsLogin(false);
    navigation.navigate('Auth');
  };

  handleEditProfile = () => {
    const {navigation} = this.props;
    navigation.navigate('EditProfile');
  };

  handleContactSupport = () => {
    const timeStamp = new Date().toTimeString();
    const systemVersion = `${Platform.OS} ${Platform.Version}`;
    const deviceModel = DeviceInfo.getModel();
    const app = `${DeviceInfo.getApplicationName()} ${DeviceInfo.getVersion()}`;

    const bodyTemplate = `TimeStamp: ${timeStamp}\nSystem Version: ${systemVersion}\nDevice Model: ${deviceModel}\nApp Version: ${app}`;
    Linking.openURL(`mailto:support@tiltchat.com?&body=${bodyTemplate}`);
  };

  handleInvitePeople = () => {
    const {navigation} = this.props;
    navigation.navigate('InviteContacts');
  };

  handleBlocked = () => {
    const {navigation} = this.props;
    navigation.navigate('BlockUser');
  };

  updateSwitchValue = () => {
    const {global_push_enable} = this.props;
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          if (global_push_enable) {
            await this.props.disableGlobalNotifications();
          } else {
            await this.props.enableGlobalNotifications();
          }
        } catch (ex) {
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  render() {
    const {theme, navigation, global_push_enable} = this.props;
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        style={{flex: 1, backgroundColor: theme.secondaryBackgroundColor}}>
        {/* <TopBlockSpace /> */}
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.borderBottomColor,
              marginTop: 35,
              borderTopWidth: StyleSheet.hairlineWidth,
            },
          ]}
          onPress={this.handleEditProfile}>
          <Image style={styles.icon} source={EDIT} />
          <Text style={[styles.buttonText, {color: theme.primaryTextColor}]}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            {
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.borderBottomColor,
            },
          ]}
          onPress={this.handleBlocked}>
          <Image style={styles.icon} source={BLOCKED_GREEN} />
          <Text style={[styles.buttonText, {color: theme.primaryTextColor}]}>
            Blocked Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            {
              justifyContent: 'space-between',
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.borderBottomColor,
            },
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.icon} source={BELL} />
            <View>
              <Text
                style={[styles.buttonText, {color: theme.primaryTextColor}]}>
                Disable All Notifications
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              />
            </View>
          </View>
          <Switch
            trackColor={{
              true: StyleSheet.value('#17C491'),
              false: 'rgba(0, 0, 0, 0.1)',
            }}
            value={!global_push_enable}
            onValueChange={this.updateSwitchValue}
            thumbColor="#F6F7F9"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            {
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.borderBottomColor,
            },
          ]}
          onPress={this.handleInvitePeople}>
          <Image style={styles.icon} source={INVITE_PEOPLE} />
          <Text style={[styles.buttonText, {color: theme.primaryTextColor}]}>
            Invite People
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            {
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.borderBottomColor,
            },
          ]}
          onPress={() => {
            navigation.navigate('Themes');
          }}>
          <Image style={styles.icon} source={MOON} />
          <Text style={[styles.buttonText, {color: theme.primaryTextColor}]}>
            Theme
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.borderBottomColor,
              marginBottom: 35,
            },
          ]}
          onPress={this.handleContactSupport}>
          <Image style={styles.icon} source={SUPPORT} />
          <Text style={[styles.buttonText, {color: theme.primaryTextColor}]}>
            Contact Support
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            {
              backgroundColor: theme.primaryBackgroundColor,
              borderColor: theme.borderBottomColor,
              borderTopWidth: StyleSheet.hairlineWidth,
            },
          ]}
          onPress={this.handleLogout}>
          <Text
            style={[
              styles.buttonText,
              styles.logoutText,
              {color: theme.tiltRed},
            ]}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({themes, login}) => ({
  theme: themes[themes.current],
  themeName: themes.current,
  global_push_enable:
    login.user && login.user.notify_props
      ? login.user.notify_props.push === 'mention'
      : false,
});

const mapDispatchToProps = {
  dispatchLogout: logout,
  dispatchIsLogin: isLogin,
  changeTheme,
  enableGlobalNotifications,
  disableGlobalNotifications,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoggedInMenu);
