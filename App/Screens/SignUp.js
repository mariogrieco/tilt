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
import assets from '../components/ThemeWrapper/assets';
import isSignUp from '../actions/signup';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonText: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    paddingTop: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  leftButton: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: '$borderRadius',
    borderBottomLeftRadius: '$borderRadius',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightButton: {
    borderLeftWidth: StyleSheet.hairlineWidth,
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

const Feature = ({text, icon, textColor}) => (
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
    <Text style={[styles.text, {textAlign: 'left', flex: 1, color: textColor}]}>
      {text}
    </Text>
  </View>
);

const Buttons = ({
  onSignUp,
  onLogin,
  leftButtonStyle = {},
  buttonTextStyle = {},
  rightButtonStyle = {},
}) => (
  <SafeAreaView style={styles.buttonView}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={onSignUp}
        style={[styles.button, styles.leftButton, leftButtonStyle]}>
        <Text style={[styles.buttonText, buttonTextStyle]}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onLogin}
        style={[styles.button, styles.rightButton, rightButtonStyle]}>
        <Text style={[styles.buttonText, buttonTextStyle]}>Log In</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

class SignUp extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.getParam('title', ''),
    ...headerForScreenWithTabs({
      headerStyle: {backgroundColor: screenProps.theme.primaryBackgroundColor},
    }),
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
    const {theme, themeName} = this.props;
    const iconsTheme = assets[themeName];
    return (
      <View
        style={[
          styles.mainContainer,
          {backgroundColor: theme.primaryBackgroundColor},
        ]}>
        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={iconsTheme.LOGO} style={styles.logo} />
              <View style={[styles.signUpToExperienceView, {paddingTop: 10}]}>
                <Text
                  style={[
                    styles.signUpToExperience,
                    {color: theme.primaryTextColor},
                  ]}>
                  Sign up to experience the best of Tilt
                </Text>
              </View>
            </View>
            <View style={[styles.principalContainer]}>
              <FeatureGroup>
                <Feature
                  icon={iconsTheme.GROUPCHAT}
                  textColor={theme.primaryTextColor}
                  text="Chat with traders"
                />
                <Feature
                  icon={iconsTheme.PHONE}
                  textColor={theme.primaryTextColor}
                  text="Start and join voice calls"
                />
                <Feature
                  icon={iconsTheme.VIDEO}
                  textColor={theme.primaryTextColor}
                  text="Start and join video calls"
                />
                <Feature
                  icon={iconsTheme.NETWORK}
                  textColor={theme.primaryTextColor}
                  text="1000s of communities"
                />
                <Feature
                  icon={iconsTheme.ROBOT}
                  textColor={theme.primaryTextColor}
                  text="Intelligent bots"
                />
                <Feature
                  icon={iconsTheme.MARKETDATA}
                  textColor={theme.primaryTextColor}
                  text="Real-time market data"
                />
              </FeatureGroup>
            </View>
          </View>
        </ScrollView>
        <View style={[styles.buttonsContainer]}>
          <Buttons
            onSignUp={this.goToSignUp}
            onLogin={this.goToLogin}
            leftButtonStyle={{borderRightColor: theme.primaryBackgroundColor}}
            rightButtonStyle={{borderLeftColor: theme.primaryBackgroundColor}}
            buttonTextStyle={{color: theme.buttonTextColor}}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({login, themes}) => ({
  user: login.user,
  theme: themes[themes.current],
  themeName: themes.current,
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
