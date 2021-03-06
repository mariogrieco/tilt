import React from 'react';
import {
  View,
  TextInput,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
import CountryPicker from 'react-native-country-picker-modal';
import Form from '../components/Form';
import GoBack from '../components/GoBack';
import InputSeparator from '../components/InputSeparator';
import {getVerificationCode} from '../actions/codeVerification';
import {ifIphoneX} from 'react-native-iphone-x-helper';

const EMPTY_WARNING =
  'Please enter your 10-digit phone number without spaces, dashes or parenthesis.';
const ENOUGH_DIGITS_WARNING =
  'Your phone number should not contain spaces, dashes or parenthesis.';
const DIGITS_WITH_SPACE_WARNING =
  'Please enter your 10-digit phone number without spaces, dashes or parenthesis.';

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
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
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
    color: '#585C63',
    textAlign: 'center',
  },
});

class PhoneNumber extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'Enter Phone Number'),
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
  });

  state = {
    phoneNumber: '',
    country: {
      cca2: 'US',
      name: 'United States',
      callingCode: ['1'],
    },
  };

  navigationToVerification = async () => {
    const {navigation} = this.props;
    const {phoneNumber, country} = this.state;
    if (!phoneNumber) {
      Alert.alert(EMPTY_WARNING);
    } else if (phoneNumber.length === 10) {
      if (phoneNumber.includes(' ')) {
        Alert.alert(ENOUGH_DIGITS_WARNING);
        return;
      }
      try {
        await this.props.getVerificationCode(
          phoneNumber,
          country.callingCode[0],
        );
        navigation.navigate('Verification');
      } catch (ex) {
        alert(ex);
      }
    } else {
      Alert.alert(DIGITS_WITH_SPACE_WARNING);
    }
  };

  render() {
    const {phoneNumber} = this.state;
    return (
      <DismissKeyboard>
        <View style={{flex: 1}}>
          <Form
            canSend={true}
            textButton="Continue"
            navigationTo={this.navigationToVerification}
            keyboardVerticalOffset={
              Platform.OS === 'ios' ? ifIphoneX(95, 80) : 0
            }>
            <View style={styles.textContainer}>
              {/* eslint-disable-next-line max-len */}
              <Text style={styles.textBold}>
                Enter your 10-digit phone number. We’ll send you a text for
                verification.
              </Text>
            </View>
            {/* eslint-disable-next-line no-sequences */}
            <View style={[styles.inputContainer]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: Platform.OS === 'ios' ? 13 : 0,
                }}>
                <CountryPicker
                  countryCode={this.state.country.cca2}
                  withFilter
                  withCallingCodeButton
                  withCallingCode
                  withCurrency={false}
                  withAlphaFilter
                  onSelect={country => this.setState({country})}
                />
                <TextInput
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={_phoneNumber =>
                    this.setState({phoneNumber: _phoneNumber})
                  }
                  placeholder="Enter your phone number"
                  style={[styles.placeholders]}
                  value={phoneNumber}
                  selectionColor="#17C491"
                />
              </View>
              <InputSeparator />
            </View>
          </Form>
        </View>
      </DismissKeyboard>
    );
  }
}

const mapDispatchToProps = {
  getVerificationCode,
};

const mapStateToProps = ({codeVerification}) => codeVerification;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhoneNumber);
