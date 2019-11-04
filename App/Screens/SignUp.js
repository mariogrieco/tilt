import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
  // Linking
} from 'react-native';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
// import SplashScreen from 'react-native-smart-splash-screen';
import isSignUp from '../actions/signup';
import {ifIphoneX} from 'react-native-iphone-x-helper';

const LOGO = require('../../assets/images/logo/LogoSignUp.png');
const GROUPCHAT = require('../../assets/images/groupChat/groupChat.png');
const MARKETDATA = require('../../assets/images/marketData/marketData.png');
const PHONE = require('../../assets/images/phone-call/phone-call-button.png');
const VIDEO = require('../../assets/images/video/video.png');
const NETWORK = require('../../assets/images/network/network.png');
const ROBOT = require('../../assets/images/robot/robot.png');

const styles = StyleSheet.create({
  container: {
    marginTop: '14%',
  },
  logo: {
    // marginTop: '1rem'
  },
  signUpToExperienceView: {
    marginTop: '1.375rem',
    marginBottom: '1.375rem',
  },
  signUpToExperience: {
    fontFamily: 'SFProDisplay-Heavy',
    fontSize: 17,
    letterSpacing: 0.1,
    textAlign: 'center',
    color: '$textColor',
    marginTop: '1.5rem',
  },
  options: {
    flexDirection: 'row',
    margin: '0.5rem',
  },
  icon: {
    marginLeft: 25,
  },
  text: {
    fontFamily: 'SFProDisplay-Regular',
    fontSize: 16,
    letterSpacing: 0.1,
    textAlign: 'center',
    color: '$textColor',
    marginLeft: 25,
  },
  buttonView: {
    marginBottom: Platform.OS === 'ios' ? ifIphoneX(null, 10) : 10,
    marginLeft: 15,
    marginRight: 15,
  },
  button: {
    backgroundColor: '#17C491',
    flex: 1,
    height: 44,
    // height: '2.75rem',
  },
  buttonText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: 'white',
    paddingTop: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  leftButton: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'white',
    borderTopLeftRadius: '$borderRadius',
    borderBottomLeftRadius: '$borderRadius',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightButton: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'white',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: '$borderRadius',
    borderBottomRightRadius: '$borderRadius',
  },
  joinButton: {
    borderRadius: '$borderRadius',
  },
  recommendedText: {
    flex: 1,
    textAlign: 'center',
    marginTop: '1rem',
    marginBottom: '1.0625rem',
    color: '#17C491',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },

  offers: {
    paddingBottom: '1.5rem',
  },
  principalContainer: {
    marginTop: '1rem',
    marginBottom: '0.5rem',
    justifyContent: 'center',
  },
  featureGroup: {
    marginBottom: '3.125rem',
  },
});

const FeatureGroup = ({children}) => (
  <View style={styles.featureGroup}>{children}</View>
);

const Feature = ({text, icon}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingBottom: 15,
    }}>
    <View style={{flex: 0.4, alignItems: 'flex-start'}}>
      <Image source={icon} style={styles.icon} />
    </View>
    <Text style={[styles.text, {textAlign: 'left', flex: 1}]}>{text}</Text>
  </View>
);

const Buttons = ({onSignUp, onLogin}) => (
  <SafeAreaView style={styles.buttonView}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={onSignUp}
        style={[styles.button, styles.leftButton]}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLogin}
        style={[styles.button, styles.rightButton]}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

class SignUp extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', ''),
    headerStyle: {
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      elevation: 0,
      backgroundColor: '#FFF',
    },
  });

  componentDidMount() {
    this.navigationListener = this.props.navigation.addListener(
      'didFocus',
      this.handleisAuth,
    );
    // SplashScreen.close({
    //   animationType: SplashScreen.animationType.scale,
    //   duration: 180,
    //   delay: 1000,
    // });
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  goToSignUp = () => {
    this.props.isSignUp(true);
    this.props.navigation.navigate('CreateAccount');
  };

  goToLogin = () => {
    this.props.isSignUp(false);
    this.props.navigation.navigate('LogIn');
  };

  handleisAuth = () => {
    if (this.props && this.props.user) {
      this.props.navigation.navigate('Home');
    } else {
      // alert('no log')
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <ScrollView>
            <View style={styles.container}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image source={LOGO} style={styles.logo} />
                <View style={[styles.signUpToExperienceView, {paddingTop: 10}]}>
                  <Text style={styles.signUpToExperience}>
                    Sign up to experience the best of Tilt
                  </Text>
                </View>
              </View>
              <View style={[styles.principalContainer]}>
                <FeatureGroup>
                  <Feature icon={GROUPCHAT} text="Chat with traders" />
                  <Feature icon={PHONE} text="Start and join voice calls" />
                  <Feature icon={VIDEO} text="Start and join video calls" />
                  <Feature icon={NETWORK} text="1000s of communities" />
                  <Feature icon={ROBOT} text="Intelligent bots" />
                  <Feature icon={MARKETDATA} text="Real-time market data" />
                </FeatureGroup>
              </View>
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <Buttons onSignUp={this.goToSignUp} onLogin={this.goToLogin} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login.user,
});

const mapDispatchToProps = {
  isSignUp,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SignUp),
);
