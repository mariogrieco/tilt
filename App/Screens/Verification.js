import React from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import isEqual from 'lodash/isEqual';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import Form from '../components/Form';
import GoBack from '../components/GoBack';
import LoadingSpinner from '../components/LoadingSpinner';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');
const LOCKED = require('../../assets/themes/light/locked/locked.png');

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
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    marginBottom: '4rem',
  },
  inputContainer: {
    flex: 1,
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
  text: {
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#565656',
    textAlign: 'center',
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
  modal: {
    width: '18rem',
    height: '21rem',
    alignSelf: 'center',
    alignItems: 'center',
    color: '$textColor',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
  },
  imageModal: {
    marginTop: '2rem',
    marginBottom: '2.5rem',
  },
  textContainerModal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textModalTitle: {
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    marginBottom: '1.2rem',
    color: '#0e141e',
  },
  textModal: {
    fontFamily: 'SFProDisplay-Medium',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
    marginBottom: '1.2rem',
  },
  buttonModal: {
    backgroundColor: '#17C491',
    width: '14rem',
    height: '2.75rem',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: 'white',
    padding: '0.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  viewBorder: {
    overflow: 'hidden',
    borderTopLeftRadius: '$borderRadius',
    borderBottomLeftRadius: '$borderRadius',
    borderTopRightRadius: '$borderRadius',
    borderBottomRightRadius: '$borderRadius',
    width: '14rem',
    height: '2.75rem',
    marginBottom: '1rem',
  },
});

class Verification extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.getParam('title', 'Verification'),
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

  state = {
    password: '',
    isModalVisible: false,
    code: '',
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  setCode = code => {
    console.log('state code ', code);
    this.setState({
      code,
    });
  };

  continueNavigation = () => {
    const {code} = this.state;
    const {codeVerification, navigation} = this.props;
    if (codeVerification.hasData) {
      // console.log(` here => ${codeVerification.code}`);
      // console.log('i got => ', code);
      if (code !== codeVerification.code) {
        Alert.alert('The code you entered does not match. Please try again.');
      } else {
        navigation.navigate('CreateAccount');
      }
    }

    if (codeVerification.err) {
      Alert.alert('An error occurred. Please request a new code.');
    }
  };

  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
    this.props.navigation.navigate('SignUp');
  };

  renderModal = () => (
    <Modal isVisible={this.state.isModalVisible}>
      <View style={[styles.modal, {justifyContent: 'space-between'}]}>
        <Image source={LOCKED} style={styles.imageModal} />
        <View style={styles.textContainer}>
          <Text style={styles.textModalTitle}>Password Updated</Text>
          <Text style={styles.textModal}>
            Please log in with your new password.
          </Text>
        </View>
        <View style={styles.viewBorder}>
          <Text style={styles.buttonModal} onPress={this.toggleModal}>
            Done
          </Text>
        </View>
      </View>
    </Modal>
  );

  render() {
    const {codeVerification} = this.props;
    const {code} = this.state;
    return (
      <DismissKeyboard>
        <View style={{flex: 1}}>
          {this.state.isModalVisible && this.renderModal()}
          <Form
            canSend={true}
            textButton="Continue"
            navigationTo={this.continueNavigation}
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? ifIphoneX(95, 80) : 0
            }>
            <View style={styles.textContainerModal}>
              <Text style={styles.textBold}>
                Please enter the 6-digit verification code sent to your email.
              </Text>
              <Text style={styles.textBold}>
                {`+${codeVerification.callingCode}${
                  codeVerification.phoneNumber
                }`}
              </Text>
            </View>
            <View style={styles.inputContainer}>
              {codeVerification.hasData ? (
                <OTPInputView
                  style={{alignSelf: 'center', width: '80%', height: 100}}
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
              ) : (
                <LoadingSpinner />
              )}
              {codeVerification.err && (
                <Text>An error occurred. Please request a new code.</Text>
              )}
            </View>
            {!this.props.signUp.isSignUp && (
              <TextInput
                placeholder="Create New Password"
                onChangeText={password => {
                  this.setState({password});
                }}
                secureTextEntry
                style={styles.placeholders}
                selectionColor="#17C491"
              />
            )}
          </Form>
        </View>
      </DismissKeyboard>
    );
  }
}

const mapStateToProps = ({signUp, codeVerification}) => ({
  signUp,
  codeVerification,
});

export default connect(
  mapStateToProps,
  null,
)(Verification);
