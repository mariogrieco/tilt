import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
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

const EDIT = require('../../assets/themes/light/tune-black/tune.png');
const INVITE_PEOPLE = require('../../assets/themes/light/add-friend-black/add-friend.png');
// const NOTIFICATIONS = require('../../assets/themes/light/bell-black/002-bell.png');
const SUPPORT = require('../../assets/themes/light/support/support.png');
const BACK = require('../../assets/themes/light/pin-left-black/pin-left.png');

const styles = StyleSheet.create({
  row: {
    paddingTop: 12,
    paddingBottom: 13,
    paddingLeft: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
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

  render() {
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
        {/*<TouchableOpacity style={[styles.row, styles.button]}>*/}
        {/*  <Image style={styles.icon} source={NOTIFICATIONS} />*/}
        {/*  <Text style={styles.buttonText}>Notifications</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<BlockSpace />*/}
        <TouchableOpacity
          style={[styles.row, styles.button]}
          onPress={this.handleInvitePeople}>
          <Image style={styles.icon} source={INVITE_PEOPLE} />
          <Text style={styles.buttonText}>Invite People</Text>
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
};

export default connect(
  null,
  mapDispatchToProps,
)(LoggedInMenu);
