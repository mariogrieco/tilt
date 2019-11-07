import React, {PureComponent} from 'react';
// import {Text, View} from 'react-native';
// import {WebView} from 'react-native-webview';
import GoBack from '../components/GoBack';
import BlockedList from '../components/BlockedList';
import {NavigationActions} from 'react-navigation';

const BACK = require('../../assets/images/pin-left/pin-left.png');

export default class BlockedUsers extends PureComponent {
  static navigationOptions = ({navigation}) => ({
    title: 'Blocked Users',
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  render() {
    return <BlockedList />;
  }
}
