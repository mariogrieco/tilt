import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import NavigationService from '../../config/NavigationService';
import {setCurrentDisplayUserProfile} from '../../actions/users';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import styles from './styles';

const SearchUserDisplay = ({
  username,
  id,
  loggedUserId,
  pictureUrl,
  dispatchGoToMemberProfile,
  theme,
}) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => {
      if (id !== loggedUserId) {
        dispatchGoToMemberProfile(id);
        NavigationService.navigate('MemberProfile');
      } else {
        NavigationService.navigate('LoggedIn');
      }
    }}>
    <Image style={styles.image} source={{uri: pictureUrl}} />
    <View style={styles.textContainer}>
      <Text style={[styles.text, {color: theme.primaryTextColor}]}>
        {username}
      </Text>
    </View>
  </TouchableOpacity>
);

SearchUserDisplay.defaultProps = {
  username: '',
  id: '',
  loggedUserId: '',
};

const mapDispatchToProps = {
  dispatchGoToMemberProfile: setCurrentDisplayUserProfile,
};

const mapStateToProps = ({login: {user}, themes}, props) => {
  if (user) {
    return {
      loggedUserId: user.id,
      pictureUrl: getUserProfilePicture(props.id, user.last_picture_update),
      theme: themes[themes.current],
    };
  }
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchUserDisplay);
