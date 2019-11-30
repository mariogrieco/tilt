import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import UserProfile from '../components/UserProfile';
import {getChannels, getMyChannels} from '../actions/channels';
import {getPostsByChannelId} from '../actions/posts';
import {
  getProfilesInGroupChannels,
  setCurrentDisplayUserProfile,
} from '../actions/users';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
import assets from '../config/themeAssets/assets';

class LoggedIn extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Profile',
    headerLeft: null,
    headerRight: (
      <TouchableOpacity
        style={{paddingHorizontal: 15, paddingVertical: 13}}
        onPress={() => navigation.navigate('LoggedInMenu')}>
        <Image source={assets[screenProps.themeName].MENU} />
      </TouchableOpacity>
    ),
    ...headerForScreenWithBottomLine({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
  });

  componentDidMount() {
    const {navigation, loggedUserId} = this.props;

    this.props.setCurrentDisplayUserProfile(loggedUserId);
    this.navigationListener = navigation.addListener('didFocus', () => {
      this.getPostChannelsAndUsersData();
      this.props.setCurrentDisplayUserProfile(loggedUserId);
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
  setCurrentDisplayUserProfile,
};

const mapStateToProps = ({login}) => ({
  loggedUserId: login.user ? login.user.id : '',
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoggedIn);
