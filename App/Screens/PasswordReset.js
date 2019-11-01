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
    paddingLeft: Platform.OS === 'ios' ? 10 : 0,
    paddingBottom: Platform.OS === 'ios' ? 0 : 5,
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
    country: {
      cca2: 'US',
      name: 'United States',
      callingCode: ['1'],
    },
    formattedNumber: '+1',
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
      const {username, formattedNumber} = this.state;
      await this.props.getVerificationCode({
        username,
        formattedNumber,
      });
      // this.props.resetPasswordModal(true);
      this.props.navigation.navigate('Recovery');
    } catch (err) {
      alert(err);
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
                Enter the 10-digit phone number and username you used to sign
                up. We will send you a code to verify.
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 5,
                }}>
                <CountryPicker
                  countryCode={this.state.country.cca2}
                  withFilter
                  withCallingCodeButton
                  withCallingCode
                  withCurrency={false}
                  withAlphaFilter
                  onSelect={country =>
                    this.setState(state => {
                      return {
                        country,
                        formattedNumber: `+${country.callingCode[0] || ''}${
                          state.phoneNumber
                        }`,
                      };
                    })
                  }
                />
                <TextInput
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={number => {
                    this.setState(state => {
                      return {
                        phoneNumber: number,
                        formattedNumber: `+${
                          state.country.callingCode[0]
                        }${number}`,
                      };
                    });
                  }}
                  placeholder="Enter your phone number"
                  style={[styles.placeholders]}
                  value={this.state.phoneNumber}
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
