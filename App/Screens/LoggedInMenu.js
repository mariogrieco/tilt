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
import BlockSpace from '../components/BlockSpace';
import TopBlockSpace from '../components/TopBlockSpace';
import Separator from '../components/Separator';
import {isLogin, logout} from '../actions/login';

import {
  enableGlobalNotifications,
  disableGlobalNotifications,
} from '../actions/users';

const EDIT = require('../../assets/images/tune-black/tune.png');
const INVITE_PEOPLE = require('../../assets/images/add-friend-black/add-friend.png');
// const NOTIFICATIONS = require('../../assets/images/bell-black/002-bell.png');
const SUPPORT = require('../../assets/images/support/support.png');
const BACK = require('../../assets/images/pin-left-black/pin-left.png');
const BLOCKED_GREEN = require('../../assets/images/block-user-green/block-user-green.png');
const BELL = require('../../assets/images/bell-black/002-bell.png');

const styles = StyleSheet.create({
  row: {
    height: 44,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '$textColor',
  },
  logoutText: {
    color: '$red',
  },
  icon: {
    marginRight: 15,
  },
});

class LoggedInMenu extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Menu',
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  handleLogout = () => {
    const {dispatchLogout, dispatchIsLogin, navigation} = this.props;
    dispatchLogout();
    dispatchIsLogin(false);
    navigation.navigate('SignUp');
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
    const {global_push_enable} = this.props;
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        style={{flex: 1, backgroundColor: '#f6f7f9'}}>
        <TopBlockSpace />
        <TouchableOpacity
          style={[styles.row, styles.button]}
          onPress={this.handleEditProfile}>
          <Image style={styles.icon} source={EDIT} />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          style={[
            styles.row,
            styles.button,
            {justifyContent: 'space-between'},
          ]}>
          <View style={{flexDirection: 'row'}}>
            <Image style={styles.icon} source={BELL} />
            <View>
              <Text style={styles.buttonText}>Disable All Notifications</Text>
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
        <BlockSpace />
        <TouchableOpacity
          style={[styles.row, styles.button]}
          onPress={this.handleInvitePeople}>
          <Image style={styles.icon} source={INVITE_PEOPLE} />
          <Text style={styles.buttonText}>Invite People</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          style={[styles.row, styles.button]}
          onPress={this.handleBlocked}>
          <Image style={styles.icon} source={BLOCKED_GREEN} />
          <Text style={styles.buttonText}>Blocked Users</Text>
        </TouchableOpacity>
        <Separator />
        <TouchableOpacity
          style={[styles.row, styles.button]}
          onPress={this.handleContactSupport}>
          <Image style={styles.icon} source={SUPPORT} />
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>
        <BlockSpace />
        <TouchableOpacity
          style={[styles.row, styles.button]}
          onPress={this.handleLogout}>
          <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
        <Separator />
      </ScrollView>
    );
  }
}

const mapDispatchToProps = {
  dispatchLogout: logout,
  dispatchIsLogin: isLogin,
  enableGlobalNotifications,
  disableGlobalNotifications,
};

const mapStateToProps = state => {
  return {
    global_push_enable:
      state.login.user && state.login.user.notify_props
        ? state.login.user.notify_props.push === 'mention'
        : false,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoggedInMenu);
