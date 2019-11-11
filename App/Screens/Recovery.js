import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Modal from 'react-native-modal';
import Dimensions from 'react-native-extra-dimensions-android';

import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import InputSeparator from '../components/InputSeparator';
import {updatePassword} from '../actions/recoveryActions';
import GoBack from '../components/GoBack';
import Form from '../components/Form';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');

const H = Dimensions.get('REAL_WINDOW_HEIGHT');
const W = Dimensions.get('REAL_WINDOW_WIDTH');

const styles = StyleSheet.create({
  modal: {
    width: '20rem',
    alignSelf: 'center',
    alignItems: 'center',
    color: '$textColor',
    backgroundColor: 'white',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  textModalTitle: {
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  placeholders: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '$textColor',
    textAlign: 'center',
    paddingBottom: 13,
    marginTop: Platform.OS === 'ios' ? '2.8rem' : '1.2rem',
  },
  textModal: {
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  textContainer: {
    marginTop: '1rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  modalOptions: {
    width: '20rem',
    paddingVertical: 15,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#DCDCDC',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textBold: {
    fontSize: 16,
    letterSpacing: 0.1,
    width: 345,
    color: '#0e141e',
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Medium',
    marginVertical: 15,
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  underlineStyleHighLighted: {
    borderColor: '#17C491',
  },
  textContainerModal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  button: {
    backgroundColor: '#17C491',
    width: '22.5rem',
    height: 44,
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: 'white',
    textAlign: 'center',
    paddingTop: 10,
    borderRadius: 22,
    overflow: 'hidden',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 0,
  },
  newPasswordButtonContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 260 : 240,
    justifyContent: 'center',
  },
  textDestructive: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '$textColor',
    flex: 1,
    textAlign: 'center',
  },
});

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

class Recovery extends PureComponent {
  state = {
    code: '',
    password: '',
    password2: '',
    loading: false,
    modalSuccess: false,
  };

  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Password Reset',
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

  recoveryAction = async () => {
    if (this.state.loading) {
      return false;
    }
    const {password} = this.state;
    const {recovery} = this.props;

    this.setState({
      loading: true,
    });
    try {
      const r = await this.props.updatePassword({
        token: recovery.token,
        newPassword: password,
      });
      this.setState({
        modalSuccess: true,
      });
    } catch (err) {
      alert(err);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  setCode = code => {
    this.setState({
      code,
    });
  };

  onPassword = password => {
    this.setState({password});
  };

  onPassword2 = password2 => {
    this.setState({password2});
  };

  passwordsAreEquals() {
    const {password, password2} = this.state;
    if (password && password2) {
      if (password2 !== password) {
        return false;
      }
    }
    return true;
  }

  renderModalSucess() {
    return (
      <Modal
        isVisible={this.state.modalSuccess}
        deviceHeight={H}
        deviceWidth={W}
        onBackdropPress={this.onCloseModalSucces}>
        <View style={styles.modal}>
          <Text style={styles.textModalTitle}>
            Your password has been updated. Please log in with your new
            password.
          </Text>
        </View>
        <View style={styles.modalOptions}>
          <Text
            style={[styles.textDestructive, {color: '#17C491'}]}
            onPress={this.onCloseModalSucces}>
            Done
          </Text>
        </View>
      </Modal>
    );
  }

  onCloseModalSucces = () => {
    this.setState(
      {
        modalSuccess: false,
      },
      () => {
        this.props.navigation.navigate('LogIn');
      },
    );
  };

  displayError(str) {
    return (
      <View>
        <Text style={{color: '#FC3E30', marginBottom: 15}}>{str}</Text>
      </View>
    );
  }

  passwordIntroduced() {
    const {password, password2} = this.state;
    return password.trim().length > 0 && password2.trim().length > 0;
  }

  validateLength() {
    const {password} = this.state;
    if (password.length < 5) {
      return false;
    }
    if (password.length > 64) {
      return false;
    }
    return true;
  }

  render() {
    const {code, password, password2, modalSuccess} = this.state;
    const {theme} = this.props;
    const {recovery} = this.props;
    console.log(recovery);
    const passAreEquals = this.passwordsAreEquals();
    const passIsOnInput = this.passwordIntroduced();
    const validLength = this.validateLength();
    const passwordValidated = passIsOnInput && validLength && passAreEquals;
    const keyboardVerticalOffset =
      Platform.OS === 'ios' ? ifIphoneX(95, 80) : 90;
    return (
      <View style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        {modalSuccess && this.renderModalSucess()}
        {recovery.token !== code && (
          <DismissKeyboard>
            <View>
              <View style={styles.textContainerModal}>
                <Text
                  style={[styles.textBold, {color: theme.primaryTextColor}]}>
                  Please enter the 6-digit verification code sent to your email.
                </Text>
                <Text style={styles.textBold}>{recovery.phoneNumber}</Text>
              </View>
              <OTPInputView
                style={{
                  alignSelf: 'center',
                  width: '80%',
                  height: 100,
                }}
                pinCount={6}
                code={code}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={this.setCode}
                onCodeChanged={_code => {
                  this.setState({code: _code});
                }}
                autoFocusOnLoad
              />
            </View>
          </DismissKeyboard>
        )}
        {recovery.token === code && (
          <DismissKeyboard>
            <View>
              <View style={styles.textContainerModal}>
                <Text
                  style={[styles.textBold, {color: theme.primaryTextColor}]}>
                  Enter your new password.
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  secureTextEntry
                  placeholder="New password"
                  onChangeText={this.onPassword}
                  style={[styles.placeholders, {color: theme.primaryTextColor}]}
                  value={password}
                  maxLength={64}
                  placeholderTextColor={theme.secondaryTextColor}
                  selectionColor="#17C491"
                />
                <InputSeparator />
                <TextInput
                  secureTextEntry
                  placeholder="Confirm new password"
                  onChangeText={this.onPassword2}
                  style={[styles.placeholders, {color: theme.primaryTextColor}]}
                  value={password2}
                  maxLength={64}
                  placeholderTextColor={theme.secondaryTextColor}
                  selectionColor="#17C491"
                />
                <InputSeparator />
              </View>
              <KeyboardAvoidingView
                keyboardVerticalOffset={keyboardVerticalOffset}
                behavior="position">
                <View style={styles.newPasswordButtonContainer}>
                  {passIsOnInput &&
                    !passAreEquals &&
                    this.displayError('Password confirmation does not match.')}
                  {!validLength &&
                    this.displayError(
                      'Your password must be at least 5 characters in length.',
                    )}
                  <View style={{marginTop: 10}}>
                    <TouchableOpacity
                      disabled={!passwordValidated}
                      onPress={
                        passwordValidated ? this.recoveryAction : () => {}
                      }>
                      <Text
                        style={[
                          styles.button,
                          !passwordValidated ? styles.disabled : {},
                        ]}>
                        Update Password
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </DismissKeyboard>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  recovery: state.recovery,
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  updatePassword,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Recovery);
