import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import UserProfile from '../components/UserProfile';
import {getChannels, getMyChannels} from '../actions/channels';
import {getPostsByChannelId} from '../actions/posts';
import {getProfilesInGroupChannels} from '../actions/users';

const MENU = require('../../assets/themes/light/menu-black/menu.png');

class LoggedIn extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Profile',
    headerLeft: null,
    headerRight: (
      <TouchableOpacity
        style={{paddingHorizontal: 15, paddingVertical: 13}}
        onPress={() => navigation.navigate('LoggedInMenu')}>
        <Image source={MENU} />
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    const {navigation} = this.props;

    this.navigationListener = navigation.addListener('didFocus', () => {
      this.getPostChannelsAndUsersData();
    });
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  getPostChannelsAndUsersData = async () => {
    try {
      const [myChannels, channels, profiles] = await Promise.all([
        this.props.getMyChannels(),
        this.props.getChannels(),
        this.props.getProfilesInGroupChannels(),
      ]);
      const posts = await this.props.getPostsByChannelId(myChannels);
    } catch (ex) {
      alert(ex.message);
    }
  };

  render() {
    return <UserProfile itsMe />;
  }
}

const mapDispatchToProps = {
  getChannels,
  getMyChannels,
  getPostsByChannelId,
  getProfilesInGroupChannels,
};

export default withNavigation(
  connect(
    () => ({}),
    mapDispatchToProps,
  )(LoggedIn),
);
