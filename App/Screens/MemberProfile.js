import React from 'react';
import {NavigationActions} from 'react-navigation';
import GoBack from '../components/GoBack';
import UserProfile from '../components/UserProfile';

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');

class MemberProfile extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Profile',
    headerLeft: (
      <GoBack
        
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  render() {
    return <UserProfile />;
  }
}

export default MemberProfile;
