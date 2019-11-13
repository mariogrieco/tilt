import React from 'react';
import {NavigationActions} from 'react-navigation';
import GoBack from '../components/GoBack';
import UserProfile from '../components/UserProfile';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

class MemberProfile extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Profile',
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
    return <UserProfile />;
  }
}

export default MemberProfile;
