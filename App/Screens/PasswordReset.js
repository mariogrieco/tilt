import React from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import StyleSheet from 'react-native-extended-stylesheet';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import CountryPicker from 'react-native-country-picker-modal';
import Form from '../components/Form';
import {resetPasswordModal} from '../actions/modal';
import {resetPassword} from '../actions/login';
import {getVerificationCode} from '../actions/recoveryActions';
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
    fontFamily: 'SFProDisplay-Regular',
    color: '$textColor',
    textAlign: 'center',
    paddingBottom: 13,
    marginTop: Platform.OS === 'ios' ? '2.8rem' : '1.2rem',
  },
  phoneNumber: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    color: '$textColor',
    textAlign: 'center',
    paddingLeft: 10,
  },
  inputContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? -170 : -30,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  textBold: {
    fontSize: 16,
    letterSpacing: 0.1,
    marginHorizontal: 15,
    color: '#0e141e',
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Medium',
    marginVertical: 15,
  },
});

class PasswordReset extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'Password Reset'),
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  state = {
    username: '',
    phoneNumber: '',
    email: '',
    country: {
      cca2: 'US',
      name: 'United States',
      callingCode: ['1'],
    },
  };

  validateEmail = email => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  // componentDidMount() {
  // this.props.navigation.navigate('Recovery');
  // }

  navitationToUserReset = async () => {
    try {
      const {username, email} = this.state;
      await this.props.getVerificationCode({
        username,
        email,
      });
      // this.props.resetPasswordModal(true);
      this.props.navigation.navigate('Recovery');
    } catch (err) {
      alert(err.message);
    }
  };

  render() {
    return (
      <DismissKeyboard>
        <View style={{flex: 1}}>
          <Form
            canSend
            textButton="Reset Password"
            navigationTo={this.navitationToUserReset}
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? ifIphoneX(95, 80) : 0
            }>
            <View style={styles.textContainer}>
              <Text style={styles.textBold}>
                Enter the email and username you used to sign up. We will send
                you a code to verify.
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 13,
                }}>
                <TextInput
                  onChangeText={_email => {
                    this.setState({email: _email});
                  }}
                  placeholder="Enter your email"
                  style={[styles.phoneNumber]}
                  value={this.state.email}
                />
              </View>
              <InputSeparator />
              <TextInput
                placeholder="Username"
                onChangeText={username => {
                  this.setState({username});
                }}
                style={styles.placeholders}
                autoCapitalize="none"
              />
              <InputSeparator />
            </View>
          </Form>
        </View>
      </DismissKeyboard>
    );
  }
}

const mapDispatchToProps = {
  resetPasswordModal,
  resetPassword,
  getVerificationCode,
};

const mapStateToProps = state => ({
  me: state.login,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PasswordReset);
