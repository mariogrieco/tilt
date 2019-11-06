import React, {PureComponent} from 'react';
// import {Text, View} from 'react-native';
import {WebView} from 'react-native-webview';
import GoBack from '../components/GoBack';
import {NavigationActions} from 'react-navigation';

const BACK = require('../../assets/images/pin-left/pin-left.png');

export default class TermsWeb extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    title: 'Terms',
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.disatch(NavigationActions.back())}
      />
    ),
  });

  render() {
    return (
      <WebView scrollEnabled source={{uri: 'https://www.tiltchat.com/terms'}} />
    );
  }
}
