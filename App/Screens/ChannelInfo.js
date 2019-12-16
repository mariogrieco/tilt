import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';
import Dimensions from 'react-native-extra-dimensions-android';
import {connect} from 'react-redux';
import moment from 'moment';
import ParsedText from 'react-native-parsed-text';
import BlockSpace from '../components/BlockSpace';
import BottomBlockSpace from '../components/BottomBlockSpace';
import Separator from '../components/Separator';
import getPostAndChannelById from '../selectors/getPostAndChannelById';
import getUserProfilePicture from '../selectors/getUserProfilePicture';
import GoBack from '../components/GoBack';
import {
  setFavoriteChannel,
  deleteFavoriteChannel,
  removeFromChannel,
  deleteChannel,
  getMuteUnMutePreferences,
} from '../actions/channels';
import {muteChannelAction, unmuteChannelAction} from '../actions/preferences';
import {removePostFromChannelId} from '../actions/posts';
import {
  handleUrlPress,
  handleConvertedUrlPress,
  handleEmailPress,
} from '../utils/uurls';
import {archiveChannelActive} from '../actions/archiveChannel';
import {setCurrentDisplayUserProfile} from '../actions/users';
import {getFavoriteChannelById} from '../selectors/getFavoriteChannels';
import Spacer from '../components/Spacer';
import BottomBlockSpaceSmall from '../components/BottomBlockSpaceSmall';
import MiddleBlockSpaceSmall from '../components/MiddleBlockSpaceSmall';
import getChannelMuteConf from '../selectors/getChannelMuteConf';
import {NavigationActions} from 'react-navigation';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

const H = Dimensions.get('REAL_WINDOW_HEIGHT');
const W = Dimensions.get('REAL_WINDOW_WIDTH');

const STAR = require('../../assets/themes/light/star-black/star.png');
const BELL = require('../../assets/themes/light/bell-black/002-bell.png');
const MEMBERS = require('../../assets/themes/light/add-friend-black/add-friend.png');
const EDIT = require('../../assets/themes/light/edit-black/004-edit.png');
const SIGN_OUT = require('../../assets/themes/light/sign-out-black/005-sign-out-option.png');
const ARCHIVE = require('../../assets/themes/light/archive/006-box.png');

const styles = StyleSheet.create({
  descriptionHeaderContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  channelName: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#17C491',
    fontSize: 18,
    letterSpacing: 0.1,
    paddingBottom: 30,
  },
  descriptionHeaderText: {
    paddingBottom: 15,
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  owner: {
    color: '#0e141e',
    fontFamily: 'SFProDisplay-Bold',
    paddingLeft: 8,
  },
  descriptionBodyContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  descriptionBodyText: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '#0e141e',
    paddingBottom: 15,
  },
  descriptionBodyTitle: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
    color: '#0e141e',
    paddingBottom: 15,
  },
  profilePicture: {
    height: 30,
    width: 30,
    borderRadius: 6,
  },
  modal: {
    width: '20rem',
    alignSelf: 'center',
    alignItems: 'center',
    color: '$textColor',
    backgroundColor: 'white',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    overflow: 'hidden',
    paddingHorizontal: '1rem',
  },
  textContainer: {
    marginTop: '1rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  textModalTitle: {
    fontFamily: 'SFProDisplay-Bold',
    textAlign: 'center',
    fontSize: 17,
    letterSpacing: 0.1,
    marginBottom: '1rem',
    color: '#0e141e',
  },
  textModal: {
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  textModalDescription: {
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  modalOptions: {
    width: '20rem',
    alignSelf: 'center',
    color: '$textColor',
    backgroundColor: 'white',
    borderBottomLeftRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    overflow: 'hidden',
    flexDirection: 'row',
    borderTopColor: '#DCDCDC',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textDestructive: {
    paddingTop: '0.6rem',
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '$textColor',
    flex: 1,
    textAlign: 'center',
    paddingBottom: '0.85rem',
  },
  textCancel: {
    paddingTop: '0.6rem',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
    flex: 1,
    textAlign: 'center',
    paddingBottom: '0.85rem',
  },
});

const Description = ({children, theme}) => <View>{children}</View>;
const DescriptionHeader = ({
  channelName,
  ownerName,
  createdAt,
  onOwnerPress,
  ChannelCreatorPicture,
  theme,
}) => (
  <View
    style={[
      styles.descriptionHeaderContainer,
      {backgroundColor: theme.primaryBackgroundColor},
    ]}>
    <View>
      <Text style={styles.channelName}>{channelName}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={[
            styles.descriptionHeaderText,
            {color: theme.primaryTextColor},
          ]}>
          Created by
        </Text>
        <TouchableOpacity
          onPress={onOwnerPress}
          style={{marginLeft: 10, flexDirection: 'row'}}>
          <View>
            <Image
              source={{uri: ChannelCreatorPicture}}
              style={styles.profilePicture}
            />
          </View>
          <Text
            style={[
              styles.descriptionHeaderText,
              styles.owner,
              {color: theme.primaryTextColor},
            ]}>
            {ownerName}
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[styles.descriptionHeaderText, {color: theme.primaryTextColor}]}>
        {createdAt}
      </Text>
    </View>
  </View>
);

const DescriptionBody = ({purpose, header, theme}) => (
  <View
    style={[
      styles.descriptionBodyContainer,
      {backgroundColor: theme.primaryBackgroundColor},
    ]}>
    <Text
      style={[styles.descriptionBodyTitle, {color: theme.primaryTextColor}]}>
      Purpose:
    </Text>
    <Text style={[styles.descriptionBodyText, {color: theme.primaryTextColor}]}>
      {purpose}
    </Text>
    <Spacer />
    <Text
      style={[styles.descriptionBodyTitle, {color: theme.primaryTextColor}]}>
      Header:
    </Text>
    {/* <Text style={}> */}
    <ParsedText
      childrenProps={{allowFontScaling: false}}
      style={[styles.descriptionBodyText, {color: theme.primaryTextColor}]}
      parse={[
        {
          type: 'url',
          style: {
            color: '#017AFE',
          },
          onPress: handleUrlPress,
        },
        {
          pattern: /\S+@\S+.com/,
          style: {
            color: '#017AFE',
          },
          onPress: handleConvertedUrlPress,
        },
        {
          pattern: /\S+@\S+.\S+/,
          style: {
            color: '#017AFE',
          },
          onPress: handleEmailPress,
        },
      ]}>
      {header}
    </ParsedText>
    {/* </Text> */}
  </View>
);

const Controls = ({children}) => <View>{children}</View>;

const Edit = ({
  isSwitch,
  icon,
  name,
  onPress,
  updateSwitchValue,
  switchValue,
  theme,
}) => (
  <View
    style={{
      flexDirection: 'row',
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: theme.primaryBackgroundColor,
    }}>
    {isSwitch ? (
      <React.Fragment>
        <View
          style={{
            flex: 0.7,
            paddingVertical: 11,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 0.15}}>
            <Image source={icon} />
          </View>
          <Text
            style={{
              flex: 1,
              fontFamily: 'SFProDisplay-Regular',
              fontSize: 16,
              letterSpacing: 0.1,
              color: theme.primaryTextColor,
            }}>
            {name}
          </Text>
        </View>
        <View
          style={{
            flex: 0.3,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <Switch
            trackColor={{
              true: StyleSheet.value('#17C491'),
              false: theme.secondaryBackgroundColor,
            }}
            value={switchValue}
            onValueChange={updateSwitchValue}
            thumbColor="#F6F7F9"
          />
        </View>
      </React.Fragment>
    ) : (
      <TouchableOpacity
        style={{flex: 1, paddingVertical: 11}}
        onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 0.1}}>
            <Image source={icon} />
          </View>
          <Text
            style={{
              flex: 1,
              fontFamily: 'SFProDisplay-Regular',
              fontSize: 16,
              letterSpacing: 0.1,
              color: theme.primaryTextColor,
            }}>
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    )}
  </View>
);

class ChannelInfo extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Channel Info',
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
    hasFavorite: false,
    isMuteChannel: false,
    leaveModal: false,
    archiveModal: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.favorite !== state.hasFavorite) {
      return {
        hasFavorite: props.favorite,
      };
    }
    return null;
  }

  handleFavorite = async value => {
    try {
      if (this.state.hasFavorite) {
        await this.props.deleteFavoriteChannel(
          this.props.user_id,
          this.props.channel_id,
        );
      } else {
        await this.props.setFavoriteChannel(
          this.props.user_id,
          this.props.channel_id,
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  handleMuteChannel = value => {
    this.setState({loadingMute: true}, async () => {
      try {
        const {channel_id, user_id} = this.props;
        if (!value) {
          await this.props.unmuteChannelAction(channel_id, user_id);
        } else {
          await this.props.muteChannelAction(channel_id, user_id);
        }
        await this.props.getMuteUnMutePreferences();
      } catch (ex) {
      } finally {
        this.setState({
          loadingMute: false,
        });
      }
    });
  };

  handleAddMembers = () => {
    const {navigation} = this.props;
    navigation.navigate('AddMember');
  };

  handleEditChannel = () => {
    const {navigation} = this.props;
    navigation.navigate('EditChannel');
  };

  handleLeaveChannel = () => {
    if (this.state.loadingLeave) {
      return null;
    }
    this.setState(
      {
        loadingLeave: true,
      },
      async () => {
        const {navigation} = this.props;
        try {
          await this.props.removeFromChannel(
            this.props.user_id,
            this.props.channel_id,
          );
          // await this.props.removePostFromChannelId(this.props.channel_id);
          navigation.navigate('PublicChat');
        } catch (err) {
          alert(err);
        } finally {
          this.setState({
            loadingLeave: false,
            leaveModal: false,
          });
        }
      },
    );
  };

  toggleArchiveModal = () => {
    this.setState(state => ({archiveModal: !state.archiveModal}));
  };

  handleOwnerChannelPress = () => {
    const {channel, navigation} = this.props;
    this.props.setCurrentDisplayUserProfile(
      channel.creator_id ? channel.creator_id : '',
    );
    navigation.navigate('MemberProfile');
  };

  toggleLeaveModal = () => {
    this.setState(state => ({leaveModal: !state.leaveModal}));
  };

  handleArchiveChannel = async () => {
    try {
      const nextState = !this.state.archiveModal;
      const {channel} = this.props;
      if (!nextState) {
        await this.props.deleteChannel(channel.id);
        this.props.navigation.navigate('PublicChat');
      }
      this.setState({
        archiveModal: nextState,
      });
    } catch (ex) {
      alert(ex.message || ex);
    }
  };

  redirectArchiveModal = () => {
    const {navigation} = this.props;
    this.setState({
      archiveModal: false,
    });
    this.props.archiveChannelActive(true);
    navigation.navigate('Channel');
  };

  componentDidMount() {
    this.props.getMuteUnMutePreferences();
  }

  render() {
    const {hasFavorite, leaveModal, archiveModal} = this.state;
    const {
      channel,
      iamIn,
      user_id,
      iAmAdmin,
      owner,
      isChannelMute,
      theme,
    } = this.props;
    return (
      <View style={{flex: 1}}>
        <Modal
          isVisible={this.state.archiveModal}
          deviceHeight={H}
          deviceWidth={W}
          onBackdropPress={this.toggleArchiveModal}
          useNativeDriver
          hideModalContentWhileAnimating
          animationInTiming={200}
          animationOutTiming={200}>
          <View
            style={[
              styles.modal,
              {
                backgroundColor: theme.modalPopupBackgroundColor,
              },
            ]}>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.textModalTitle,
                  {color: theme.primaryTextColor},
                ]}>
                Archive Channel
              </Text>
              <Text
                style={[
                  styles.textModalDescription,
                  {color: theme.primaryTextColor},
                ]}>
                Are you sure you want to archive{' '}
                {this.props.channel.display_name} for everyone? No one will be
                allowed to post to the channel.
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.modalOptions,
              {
                backgroundColor: theme.modalPopupBackgroundColor,
                borderTopColor: theme.borderBottomColor,
              },
            ]}>
            <Text
              style={[styles.textCancel, {color: '#007AFF'}]}
              onPress={this.toggleArchiveModal}>
              Cancel
            </Text>
            <View
              style={{
                borderLeftColor: theme.borderBottomColor,
                borderLeftWidth: StyleSheet.hairlineWidth,
              }}
            />
            <Text
              style={[styles.textDestructive, {color: '#FC3E30'}]}
              onPress={this.handleArchiveChannel}>
              Archive
            </Text>
          </View>
        </Modal>
        <Modal
          isVisible={this.state.leaveModal}
          deviceHeight={H}
          deviceWidth={W}
          onBackdropPress={this.toggleLeaveModal}
          useNativeDriver
          hideModalContentWhileAnimating
          animationInTiming={200}
          animationOutTiming={200}>
          <View
            style={[
              styles.modal,
              {backgroundColor: theme.modalPopupBackgroundColor},
            ]}>
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.textModalTitle,
                  {color: theme.primaryTextColor},
                ]}>
                Leave Channel
              </Text>
              <Text
                style={[
                  styles.textModalDescription,
                  {color: theme.primaryTextColor},
                ]}>
                Are you sure you want to leave the channel{' '}
                {this.props.channel.display_name}?
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.modalOptions,
              {
                borderTopColor: theme.borderBottomColor,
                backgroundColor: theme.modalPopupBackgroundColor,
              },
            ]}>
            <Text
              style={[styles.textCancel, {color: '#007AFF'}]}
              onPress={this.toggleLeaveModal}>
              Cancel
            </Text>
            <View
              style={{
                borderLeftColor: theme.borderBottomColor,
                borderLeftWidth: StyleSheet.hairlineWidth,
              }}
            />
            <Text
              style={[styles.textDestructive, {color: '#FC3E30'}]}
              onPress={this.handleLeaveChannel}>
              Leave
            </Text>
          </View>
        </Modal>
        <ScrollView
          style={{flex: 1, backgroundColor: theme.secondaryBackgroundColor}}>
          <MiddleBlockSpaceSmall />
          <Description>
            <DescriptionHeader
              channelName={channel ? channel.display_name : ''}
              ownerName={owner ? owner.username : ''}
              ChannelCreatorPicture={getUserProfilePicture(channel.creator_id)}
              ownerId={owner ? owner.id : ''}
              onOwnerPress={this.handleOwnerChannelPress}
              createdAt={`Created on  ${moment(channel.create_at).format(
                'MMMM D, YYYY',
              )}`}
              theme={theme}
            />
            <BottomBlockSpaceSmall />
            <DescriptionBody
              purpose={channel ? channel.purpose : ''}
              header={channel ? channel.header : ''}
              theme={theme}
            />
          </Description>
          <BottomBlockSpaceSmall />
          <Controls>
            <Edit
              icon={STAR}
              name="Favorite"
              isSwitch
              switchValue={hasFavorite}
              updateSwitchValue={this.handleFavorite}
              theme={theme}
            />
            <Separator />
            <Edit
              icon={BELL}
              name="Mute Channel"
              isSwitch
              switchValue={isChannelMute}
              updateSwitchValue={this.handleMuteChannel}
              theme={theme}
            />
            <Separator />
            <Edit
              icon={MEMBERS}
              name="Add Members"
              onPress={this.handleAddMembers}
              theme={theme}
            />
            {(channel.creator_id === user_id || iAmAdmin) && (
              <React.Fragment>
                <Separator />
                <Edit
                  icon={EDIT}
                  name="Edit Channel"
                  onPress={this.handleEditChannel}
                  theme={theme}
                />
              </React.Fragment>
            )}
            <Separator />
            {iamIn && (
              <Edit
                icon={SIGN_OUT}
                name="Leave Channel"
                onPress={this.toggleLeaveModal}
                theme={theme}
              />
            )}
            {(channel.creator_id === user_id || iAmAdmin) && (
              <React.Fragment>
                <BlockSpace />
                <Edit
                  icon={ARCHIVE}
                  name="Archive Channel"
                  onPress={this.handleArchiveChannel}
                  theme={theme}
                />
              </React.Fragment>
            )}

            <BottomBlockSpace />
          </Controls>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const channel_id = state.appNavigation.active_channel_id;
  const r = getPostAndChannelById(state); // need to be updated
  const favorite = !!getFavoriteChannelById(state, channel_id);
  const iamIn = state.mapChannels.has(channel_id)
    ? state.mapChannels.get(channel_id)
    : {};
  const iAmAdmin = state.login.user.roles.includes('admin');
  const channel = state.mapChannels.has(channel_id)
    ? state.mapChannels.get(channel_id)
    : {};
  const owner = state.users.data[channel.creator_id];
  const ChannelCreatorPicture = getUserProfilePicture(channel.creator_id);
  return {
    ...r,
    user_id: state.login.user ? state.login.user.id : null,
    channel_id,
    favorite,
    iamIn,
    iAmAdmin,
    owner,
    channel,
    ChannelCreatorPicture,
    isChannelMute: getChannelMuteConf(state, channel_id),
    theme: state.themes[state.themes.current],
  };
};

const mapDispatchToProps = {
  setFavoriteChannel,
  deleteFavoriteChannel,
  removeFromChannel,
  archiveChannelActive,
  setCurrentDisplayUserProfile,
  deleteChannel,
  removePostFromChannelId,
  getMuteUnMutePreferences,
  muteChannelAction,
  unmuteChannelAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelInfo);
