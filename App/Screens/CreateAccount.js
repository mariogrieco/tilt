import React from 'react';
import {
  View,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import isEqual from 'lodash/isEqual';
import Form from '../components/Form';
import {modalActive} from '../actions/modal';
import {verificateUser} from '../actions/codeVerification';
import {getTeams, addToTeam} from '../actions/teams';
import {isLogin, createUserAccessToken, login} from '../actions/login';
import {getChannels, getMyChannels} from '../actions/channels';
import {createUser} from '../actions/signup';
import {
  // getProfilesInChannels,
  getProfilesInGroupChannels,
  // getUsersStatus
} from '../actions/users';
import {
  getPostsByChannelId,
  // getPostThreads
} from '../actions/posts';
import {getFlagged} from '../actions/flagged';
import {getMyPreferences} from '../actions/preferences';
import GoBack from '../components/GoBack';
import InputSeparator from '../components/InputSeparator';

const BACK = require('../../assets/images/pin-left/pin-left.png');

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
const styles = StyleSheet.create({
  placeholders: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '$textColor',
    marginTop: 20,
    paddingBottom: 8,
    textAlign: 'left',
    width: 285,
    alignSelf: 'center',
  },
});

class CreateAccount extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'Create Account'),
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  state = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  navigationToHome = async () => {
    const {username, email, password, firstName, lastName} = this.state;
    const phone = this.props.phoneOnVerification;
    if (username && this.validateEmail(email) && password) {
      try {
        const {user} = await this.props.createUser(
          username,
          email,
          password,
          phone,
          firstName,
          lastName,
        );
        await this.props.login(password, username);
        const teams = await this.props.getTeams();
        await this.props.addToTeam(teams[teams.length - 1].id, user.id);
        const preferences = await this.props.getMyPreferences();
        await this.props.getFlagged();
        this.getPostChannelsAndUsersData();
        this.props.modalActive(true);
        this.props.isLogin(true);
        this.props.navigation.navigate('Home');
      } catch (ex) {
        alert(ex);
      }
    }
  };

  getPostChannelsAndUsersData = async () => {
    try {
      const [myChannels, channels, profiles] = await Promise.all([
        this.props.getMyChannels(),
        this.props.getChannels(),
        this.props.getProfilesInGroupChannels(),
      ]);
      const posts = await this.props.getPostsByChannelId(myChannels);
    } catch (ex) {
      alert(ex.message);
    }
  };

  canSend() {
    const {firstName, lastName, email, username, password} = this.state;
    return !!(
      password.trim().length > 0 &&
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      username.trim().length > 0
    );
  }

  render() {
    const {email, password, firstName, lastName, username} = this.state;
    const canSend = this.canSend();
    return (
      <DismissKeyboard>
        <View style={{flex: 1, marginVertical: 0}}>
          <Form
            canSend={canSend}
            textButton="Continue"
            navigationTo={this.navigationToHome}
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? ifIphoneX(95, 80) : 0
            }>
            <TextInput
              value={firstName}
              onChangeText={firstName => {
                this.setState({firstName});
              }}
              placeholder="First Name"
              style={styles.placeholders}
            />
            <InputSeparator />

            <TextInput
              value={lastName}
              onChangeText={lastName => {
                this.setState({lastName});
              }}
              placeholder="Last Name"
              style={styles.placeholders}
            />
            <InputSeparator />

            <TextInput
              value={email}
              onChangeText={email => {
                this.setState({email});
              }}
              placeholder="Email"
              style={styles.placeholders}
            />
            <InputSeparator />

            <TextInput
              value={username}
              onChangeText={username => {
                this.setState({username});
              }}
              placeholder="Username"
              style={styles.placeholders}
            />
            <InputSeparator />

            <TextInput
              value={password}
              onChangeText={password => {
                this.setState({password});
              }}
              placeholder="Password"
              secureTextEntry
              maxLength={12}
              style={styles.placeholders}
            />
            <InputSeparator />
          </Form>
        </View>
      </DismissKeyboard>
    );
  }
}

const mapDispatchToProps = {
  modalActive,
  isLogin,
  createUser,
  createUserAccessToken,
  verificateUser,
  login,
  getTeams,
  addToTeam,
  getFlagged,
  getMyChannels,
  getChannels,
  getProfilesInGroupChannels,
  getPostsByChannelId,
  getMyPreferences,
};

const mapStateToProps = state => ({
  phoneOnVerification: state.codeVerification.phoneNumber,
  token: state.codeVerification.code,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateAccount);
