import React from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import Modal from 'react-native-modal';
import StyleSheet from 'react-native-extended-stylesheet';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import Form from '../components/Form';
import GoBack from '../components/GoBack';
import {isLogin, userLogin, login} from '../actions/login';
import {resetPasswordModal} from '../actions/modal';
import {getChannels, getMyChannels} from '../actions/channels';
import {getPostsByChannelId, getPostThreads} from '../actions/posts';
import {
  // getProfilesInChannels,
  getProfilesInGroupChannels,
  // getUsersStatus
} from '../actions/users';
import {getCustomEmojis} from '../actions/emojis';
import {getMyPreferences} from '../actions/preferences';
import {getFlagged} from '../actions/flagged';
import {getStatuses} from '../actions/statuses';
// import {
//   getCommandsList
// } from '../actions/commands';
import InputSeparator from '../components/InputSeparator';

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');
// const EMAIL = require('../../assets/themes/light/message_black/envelope.png');

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
    marginTop: Platform.OS === 'ios' ? '2.8rem' : '1.2rem',
    textAlign: 'center',
    paddingBottom: 13,
  },
  modal: {
    width: '18rem',
    height: '12rem',
    alignSelf: 'center',
    alignItems: 'center',
    color: '$textColor',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  },
  imageModal: {
    marginTop: 20,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 25,
  },
  textModalTitle: {
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    marginBottom: '1rem',
    color: '#0e141e',
  },
  textModal: {
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  buttonModal: {
    backgroundColor: '#17C491',
    width: '7rem',
    height: 44,
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: 'white',
    paddingTop: '0.7rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    textAlign: 'center',
    borderRadius: '1.375rem',
    overflow: 'hidden',
    marginBottom: 20,
  },
});

class LogIn extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'Log In'),
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  state = {
    username: '', // can be an email
    password: '',
    isModalVisible: this.props.modal.resetPasswordModal,
    loading: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.modal.resetPasswordModal !== this.state.isModalVisible) {
      this.setState({
        isModalVisible: nextProps.modal.resetPasswordModal,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  navigationToPhoneNumber = () => {
    this.props.navigation.navigate('PasswordReset');
  };

  navigationToHome = () => {
    if (this.state.loading) return null;
    this.setState(
      {
        loading: true,
      },
      async () => {
        const {username, password} = this.state;
        if (username && password) {
          try {
            const login = await this.props.login(password, username);
            this.props.isLogin(true);
            const preferences = await this.props.getMyPreferences();
            await this.props.getFlagged();
            this.getPostChannelsAndUsersData();
            this.props.navigation.navigate('Home');
          } catch (ex) {
            alert(ex);
          } finally {
            this.setState({
              loading: false,
            });
          }
        } else {
          this.setState({
            loading: false,
          });
        }
      },
    );
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

  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
    this.props.resetPasswordModal(false);
  };

  renderModal = () => (
    <Modal isVisible={this.state.isModalVisible}>
      <View style={[styles.modal, {justifyContent: 'space-between'}]}>
        <View style={styles.textContainer}>
          <Text style={styles.textModal}>
            Please check your phone fora verification code.
          </Text>
        </View>
        <Text style={styles.buttonModal} onPress={this.toggleModal}>
          Done
        </Text>
      </View>
    </Modal>
  );

  render() {
    return (
      <DismissKeyboard>
        <View style={{flex: 1}}>
          {this.state.isModalVisible && this.renderModal()}
          <Form
            canSend
            textButton="Log In"
            showText
            linkText="Forget Password"
            navigationToPhoneNumber={this.navigationToPhoneNumber}
            navigationTo={this.navigationToHome}
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? ifIphoneX(95, 85) : 0
            }>
            <TextInput
              placeholder="Username or Email"
              name="username"
              onChangeText={username => {
                this.setState({username});
              }}
              style={styles.placeholders}
              autoCapitalize="none"
            />
            <InputSeparator />
            <TextInput
              placeholder="Password"
              secureTextEntry
              name="password"
              onChangeText={password => {
                this.setState({password});
              }}
              style={styles.placeholders}
              maxLength={64}
            />
            <InputSeparator />
          </Form>
        </View>
      </DismissKeyboard>
    );
  }
}

const mapStateToProps = ({modal}) => ({modal});

const mapDispatchToProps = {
  isLogin,
  userLogin,
  resetPasswordModal,
  login,
  getChannels,
  getPostsByChannelId,
  // getProfilesInChannels,
  getMyChannels,
  getCustomEmojis,
  getMyPreferences,
  getFlagged,
  getStatuses,
  // getCommandsList,
  getPostThreads,
  getProfilesInGroupChannels,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogIn);
