import React, {PureComponent} from 'react';
// import {Text, View} from 'react-native';
// import {WebView} from 'react-native-webview';
import GoBack from '../components/GoBack';
import BlockedList from '../components/BlockedList';
import {NavigationActions} from 'react-navigation';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

export default class BlockedUsers extends PureComponent {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Blocked Users',
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

  render() {
    return <BlockedList />;
  }
}
