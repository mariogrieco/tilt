import React, {createRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {connect} from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import GoBack from '../components/GoBack';
import Picture from '../components/Picture';
import {updateUser} from '../actions/users';
import getUserProfilePicture from '../selectors/getUserProfilePicture';
import Separator from '../components/Separator';
import Client4 from '../api/MattermostClient';
import {
  generateId,
  encodeHeaderURIStringToUTF8,
  // buildFileUploadData
} from '../components/Input/file_utils';
import {NavigationActions} from 'react-navigation';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');

const styles = StyleSheet.create({
  profilePictureContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  row: {
    paddingTop: 11,
    paddingBottom: 11,
    paddingLeft: 15,
    paddingRight: 15,
  },
  rowTitle: {
    backgroundColor: '#f6f7f9',
  },
  rowInput: {
    backgroundColor: '#FFF',
  },
  saveButton: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
    color: '#17C491',
  },
  title: {
    color: '$textColor',
    fontFamily: 'SFProDisplay-Semibold',
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    fontFamily: 'SFProDisplay-Regular',
    color: '$textColor',
  },
  bio: {
    color: '$textColor',
  },
});

class EditProfile extends React.PureComponent {
  inputRefPosition = createRef();

  inputRefName = createRef();

  inputRefFirst = createRef();

  static getDerivedStateFromProps({user}, {firstName, lastName, position}) {
    if (!(firstName || lastName || position)) {
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        position: user.position,
      };
    }
    return null;
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Edit Profile',
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

  state = {
    firstName: '',
    lastName: '',
    position: '',
    profilePicture: null,
  };

  _updateUser = () => {
    if (this.state.loading) {
      return null;
    }
    this.setState(
      {
        loading: true,
      },
      async () => {
        const {firstName, lastName, position} = this.state;
        const {updateUser, user} = this.props;
        try {
          user.first_name = firstName || user.first_name;
          user.last_name = lastName || user.last_name;
          user.position = position || user.position;
          await updateUser(user);
          this.blurAll();
          this.props.navigation.goBack();
        } catch (ex) {
          alert(ex);
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  blurAll() {
    if (this.inputRefFirst && this.inputRefFirst.current) {
      this.inputRefFirst.current.blur();
    }
    if (this.inputRefName && this.inputRefName.current) {
      this.inputRefName.current.blur();
    }
    if (this.inputRefPosition && this.inputRefPosition.current) {
      this.inputRefPosition.current.blur();
    }
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({
      onSave: this.handleSave,
    });
  }

  handleSave = () => {
    this._updateUser();
    this._saveProfilePicture();
  };

  onFirstNameChange = text => this.setState({firstName: text});

  onLastNameChange = text => this.setState({lastName: text});

  onPositionChange = text => this.setState({position: text});

  onProfilePictureChange = (err, image) => {
    if (err) {
      console.log(err);
      return;
    }
    this.setState({
      profilePicture: image,
      newProfile: image,
    });
  };

  prepareFileToUpload(data) {
    // const file = new FormData();
    const id = generateId();
    let formBoundary;
    if (Platform.os === 'ios') {
      formBoundary = '--mobile.client.file.upload';
    }
    data.name = encodeHeaderURIStringToUTF8(data.fileName);
    // file.append('channel_id', this.props.channelId);
    // file.append('client_ids', id);
    return {
      formBoundary,
      data,
      id,
    };
  }

  _saveProfilePicture = async () => {
    const {profilePicture, newProfile} = this.state;
    if (!newProfile) {
      return null;
    }
    const {data} = this.prepareFileToUpload(profilePicture);
    try {
      const userId = this.props.user.id;
      const r = await Client4.uploadProfileImage(userId, data);
      console.log(r);
    } catch (err) {
      alert(err.message || err);
    } finally {
    }
  };

  render() {
    const {firstName, lastName, position, profilePicture} = this.state;
    const {pictureUrl} = this.props;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 0;
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        style={{flex: 1, backgroundColor: '#f6f7f9'}}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={Platform.OS === 'ios' ? 'position' : undefined}>
          <View style={styles.profilePictureContainer}>
            <Picture
              source={{uri: profilePicture ? profilePicture.uri : pictureUrl}}
              camera
              onPressCamera={this.onProfilePictureChange}
            />
          </View>
          <Separator />
          <View style={[styles.row, styles.rowTitle]}>
            <Text style={styles.title}>First Name</Text>
          </View>
          <Separator />
          <TextInput
            ref={this.inputRefFirst}
            style={[styles.row, styles.rowInput, styles.input]}
            value={firstName}
            placeholder="Enter you first name"
            onChangeText={this.onFirstNameChange}
          />
          <Separator />
          <View style={[styles.row, styles.rowTitle]}>
            <Text style={styles.title}>Last Name</Text>
          </View>
          <Separator />
          <TextInput
            ref={this.inputRefName}
            style={[styles.row, styles.rowInput, styles.input]}
            value={lastName}
            placeholder="Enter your last name"
            onChangeText={this.onLastNameChange}
          />
          <Separator />
          <View style={[styles.row, styles.rowTitle]}>
            <Text style={styles.title}>Bio</Text>
          </View>
          <Separator />
          <TextInput
            ref={this.inputRefPosition}
            style={[styles.row, styles.rowInput, styles.input, styles.bio]}
            value={position}
            placeholder="Share something unique about yourself."
            onChangeText={this.onPositionChange}
            multiline
            autoCapitalize="none"
          />
          <Separator />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({login: {user}}) => ({
  user: cloneDeep(user),
  pictureUrl: getUserProfilePicture(user.id, user.last_picture_update),
});

const mapDispatchToProps = {
  updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfile);
