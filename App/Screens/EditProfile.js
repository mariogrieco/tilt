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
import {Input} from '../components/CreateChannelField';

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
    backgroundColor: '#F6F7F9',
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
  inputRefUserName = createRef();
  inputRefEmail = createRef();

  static getDerivedStateFromProps(
    {user},
    {firstName, lastName, position, username, email},
  ) {
    if (!(firstName || lastName || position || username)) {
      return {
        firstName: user.first_name,
        lastName: user.last_name,
        position: user.position,
        username: user.username,
        // email: user.email,
      };
    }
    return null;
  }

  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Edit Profile',
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
    headerRight: (
      <TouchableOpacity
        style={{
          paddingHorizontal: 15,
          paddingVertical: 13,
          backgroundColor: screenProps.theme.primaryBackgroundColor,
        }}
        onPress={navigation.getParam('onSave', () => {})}>
        <Text style={styles.saveButton}>Save</Text>
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

  state = {
    firstName: '',
    lastName: '',
    position: '',
    username: '',
    // email: '',
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
        const {firstName, lastName, position, username, email} = this.state;
        const {updateUser, user} = this.props;
        try {
          user.first_name = firstName || user.first_name;
          user.last_name = lastName || user.last_name;
          user.position = position || user.position;
          user.username = username || user.username;
          // user.email = email || user.email;
          // user.password = 'here_pass';
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
    if (this.inputRefUserName && this.inputRefUserName.current) {
      this.inputRefUserName.current.blur();
    }

    if (this.inputRefEmail && this.inputRefEmail.current) {
      this.inputRefEmail.current.blur();
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

  onUserNameChange = username => this.setState({username});

  onEmailChange = email => this.setState({email});

  prepareFileToUpload(data) {
    const id = generateId();
    let formBoundary;
    if (Platform.os === 'ios') {
      formBoundary = '--mobile.client.file.upload';
    }
    data.name = encodeHeaderURIStringToUTF8(data.fileName);
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
    const {
      firstName,
      lastName,
      position,
      profilePicture,
      username,
      // email,
    } = this.state;
    const {pictureUrl} = this.props;
    const {theme} = this.props;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 85 : 0;
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          backgroundColor: theme.secondaryBackgroundColor,
        }}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={Platform.OS === 'ios' ? 'position' : undefined}>
          <View
            style={[
              styles.profilePictureContainer,
              {backgroundColor: theme.secondaryBackgroundColor},
            ]}>
            <Picture
              source={{uri: profilePicture ? profilePicture.uri : pictureUrl}}
              camera
              onPressCamera={this.onProfilePictureChange}
            />
          </View>
          <View
            style={[
              styles.row,
              styles.rowTitle,
              {backgroundColor: theme.secondaryBackgroundColor},
            ]}>
            <Text style={[styles.title, {color: theme.primaryTextColor}]}>
              First Name
            </Text>
          </View>
          <Separator />
          <TextInput
            ref={this.inputRefFirst}
            style={[
              styles.row,
              styles.rowInput,
              styles.input,
              {
                color: theme.primaryTextColor,
                backgroundColor: theme.primaryBackgroundColor,
              },
            ]}
            value={firstName}
            placeholder="Enter you first name"
            onChangeText={this.onFirstNameChange}
            selectionColor="#17C491"
            placeholderTextColor={theme.placeholderTextColor}
            keyboardAppearance={theme.keyboardAppearanceColor}
          />
          <Separator />
          <View
            style={[
              styles.row,
              styles.rowTitle,
              {backgroundColor: theme.secondaryBackgroundColor},
            ]}>
            <Text style={[styles.title, {color: theme.primaryTextColor}]}>
              Last Name
            </Text>
          </View>
          <Separator />
          <TextInput
            ref={this.inputRefName}
            style={[
              styles.row,
              styles.rowInput,
              styles.input,
              {
                color: theme.primaryTextColor,
                backgroundColor: theme.primaryBackgroundColor,
              },
            ]}
            value={lastName}
            placeholder="Enter your last name"
            onChangeText={this.onLastNameChange}
            selectionColor="#17C491"
            placeholderTextColor={theme.placeholderTextColor}
            keyboardAppearance={theme.keyboardAppearanceColor}
          />
          <Separator />

          <View
            style={[
              styles.row,
              styles.rowTitle,
              {backgroundColor: theme.secondaryBackgroundColor},
            ]}>
            <Text style={[styles.title, {color: theme.primaryTextColor}]}>
              Username
            </Text>
          </View>
          <Separator />
          <TextInput
            ref={this.inputRefUserName}
            style={[
              styles.row,
              styles.rowInput,
              styles.input,
              {
                color: theme.primaryTextColor,
                backgroundColor: theme.primaryBackgroundColor,
              },
            ]}
            value={username}
            placeholder="Enter your username"
            onChangeText={this.onUserNameChange}
            selectionColor="#17C491"
            placeholderTextColor={theme.placeholderTextColor}
            keyboardAppearance={theme.keyboardAppearanceColor}
          />
          <Separator />
          {/* <View
            style={[
              styles.row,
              styles.rowTitle,
              {backgroundColor: theme.secondaryBackgroundColor},
            ]}>
            <Text style={[styles.title, {color: theme.primaryTextColor}]}>
              Email
            </Text>
          </View>
           <Separator />
           <TextInput
            ref={this.inputRefEmail}
            style={[
              styles.row,
              styles.rowInput,
              styles.input,
              {
                color: theme.primaryTextColor,
                backgroundColor: theme.primaryBackgroundColor,
              },
            ]}
            value={email}
            placeholder="Enter your email"
            onChangeText={this.onEmailChange}
            selectionColor="#17C491"
            placeholderTextColor={theme.placeholderTextColor}
            keyboardAppearance={theme.keyboardAppearanceColor}
          />
          <Separator /> */}
          <View
            style={[
              styles.row,
              styles.rowTitle,
              {backgroundColor: theme.secondaryBackgroundColor},
            ]}>
            <Text style={[styles.title, {color: theme.primaryTextColor}]}>
              Bio
            </Text>
          </View>
          <Separator />
          <TextInput
            ref={this.inputRefPosition}
            style={[
              styles.row,
              styles.rowInput,
              styles.input,
              styles.bio,
              {
                color: theme.primaryTextColor,
                backgroundColor: theme.primaryBackgroundColor,
              },
            ]}
            value={position}
            placeholder="Share something unique about yourself."
            onChangeText={this.onPositionChange}
            multiline
            autoCapitalize="none"
            selectionColor="#17C491"
            placeholderTextColor={theme.placeholderTextColor}
            keyboardAppearance={theme.keyboardAppearanceColor}
          />
          <Separator />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({login: {user}, themes}) => ({
  user: cloneDeep(user),
  pictureUrl: getUserProfilePicture(user.id, user.last_picture_update),
  theme: themes[themes.current],
});

const mapDispatchToProps = {
  updateUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfile);
