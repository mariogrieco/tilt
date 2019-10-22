import React from 'react';
import {Image} from 'react-native';
import {useScreens} from 'react-native-screens';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import Home from '../Screens/Home';
import PublicChat from '../Screens/PublicChat';
import CryptoRoom from '../Screens/CryptoRoom';
import SignUp from '../Screens/SignUp';
import LogIn from '../Screens/LogIn';
import CreateAccount from '../Screens/CreateAccount';
import PhoneNumber from '../Screens/PhoneNumber';
import LoggedIn from '../Screens/LoggedIn';
import LoggedInMenu from '../Screens/LoggedInMenu';
import Verification from '../Screens/Verification';
import setAvatar from '../Screens/setAvatar';
import PasswordReset from '../Screens/PasswordReset';
import CreateChannel from '../Screens/CreateChannel';
import EditChannel from '../Screens/EditChannel';
import Channel from '../Screens/Channel';
import ChannelInfo from '../Screens/ChannelInfo';
import AddMember from '../Screens/AddMember';
import MemberProfile from '../Screens/MemberProfile';
import Messages from '../Screens/Messages';
import Thread from '../Screens/Thread';
import ThreadEdit from '../Screens/ThreadEdit';
import EditProfile from '../Screens/EditProfile';
import Recovery from '../Screens/Recovery';
import InviteContacts from '../Screens/InviteContacts';
import AdvancedSearch from '../Screens/AdvancedSearch';
import {stackHeader, headerForScreenWithTabs} from './navigationHeaderStyle';
import StyleSheet from 'react-native-extended-stylesheet';

const POLL_FOCUS = require('../../assets/images/poll_focus/poll.png');
const POLL_UNFOCUS = require('../../assets/images/poll_unfocus/poll.png');
const HASHTAG_FOCUS = require('../../assets/images/hashtag_focus/hashtag_focus.png');
const HASHTAG_UNFOCUS = require('../../assets/images/hashtag_unfocus/hashtag_unfocus.png');
const PROFILE_FOCUS = require('../../assets/images/profile_focus/profile.png');
const PROFILE_UNFOCUS = require('../../assets/images/profile_unfocus/profile.png');
const MESSAGES_FOCUS = require('../../assets/images/message_black/envelope.png');
const MESSAGES_UNFOCUS = require('../../assets/images/messages-gray/envelope.png');

useScreens();

const HomeStack = createStackNavigator(
  {
    Home,
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
    navigationOptions: {
      tabBarIcon: ({focused}) =>
        focused ? (
          <Image source={POLL_FOCUS} />
        ) : (
          <Image source={POLL_UNFOCUS} />
        ),
    },
  },
);

const RoomStack = createStackNavigator(
  {
    CryptoRoom,
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
  },
);

const SignUpStack = createStackNavigator(
  {
    SignUp,
    LogIn,
    CreateAccount,
    PhoneNumber,
    Verification,
    setAvatar,
    PasswordReset,
    Recovery,
  },
  {
    // headerMode: 'none',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...headerForScreenWithTabs,
    },
    navigationOptions: {
      tabBarIcon: ({focused}) =>
        focused ? (
          <Image source={PROFILE_FOCUS} />
        ) : (
          <Image source={PROFILE_UNFOCUS} />
        ),
    },
  },
);

const LoggedInTab = createStackNavigator(
  {
    LoggedIn,
  },
  {
    // headerMode: 'none',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
    navigationOptions: {
      tabBarIcon: ({focused}) =>
        focused ? (
          <Image source={PROFILE_FOCUS} />
        ) : (
          <Image source={PROFILE_UNFOCUS} />
        ),
    },
  },
);

const PublicChatStack = createStackNavigator(
  {
    PublicChat,
    CreateChannel,
  },
  {
    navigationOptions: {
      tabBarIcon: ({focused}) =>
        focused ? (
          <Image source={HASHTAG_FOCUS} />
        ) : (
          <Image source={HASHTAG_UNFOCUS} />
        ),
    },
    defaultNavigationOptions: {
      ...stackHeader,
    },
    headerLayoutPreset: 'center',
  },
);

const MessagesStack = createStackNavigator(
  {
    Messages,
  },
  {
    navigationOptions: {
      tabBarIcon: ({focused}) =>
        focused ? (
          <Image source={MESSAGES_FOCUS} />
        ) : (
          <Image source={MESSAGES_UNFOCUS} />
        ),
    },
    defaultNavigationOptions: {
      ...stackHeader,
    },
    headerLayoutPreset: 'center',
  },
);

const TabBarPrincipal = createBottomTabNavigator(
  {
    Watchlist: HomeStack,
    Chat: PublicChatStack,
    Messages: MessagesStack,
    Profile: LoggedInTab,
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontSize: 18,
        letterSpacing: 0.1,
      },
      style: {
        borderTopColor: '#DCDCDC',
        borderTopWidth: StyleSheet.hairlineWidth,
        // shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        // shadowOpacity: 0.15,
        // shadowRadius: 3.84,
        elevation: 0,
      },
      showIcon: true,
      showLabel: false,
    },
  },
);

const LoggedInMenuStack = createStackNavigator(
  {
    LoggedInMenu,
    EditProfile,
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
  },
);

const MemberStack = createStackNavigator(
  {
    MemberProfile,
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
  },
);

const ChannelStack = createStackNavigator(
  {
    Channel,
    AdvancedSearch,
    ChannelInfo,
    EditChannel,
    AddMember,
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
  },
);

const ThreadStack = createStackNavigator(
  {
    Thread,
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
  },
);

const ThreadEditStack = createStackNavigator(
  {
    ThreadEdit,
  },
  {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      ...stackHeader,
    },
  },
);

const InviteContactsStack = createStackNavigator(
  {
    InviteContacts,
  },
  {
    defaultNavigationOptions: {
      title: 'Invite Contacts',
      ...stackHeader,
    },
    headerLayoutPreset: 'center',
  },
);

const RootStack = createStackNavigator(
  {
    SignUpStack,
    Root: TabBarPrincipal,
    Room: RoomStack,
    LoggedInMenuStack,
    ChannelStack,
    MemberStack,
    ThreadStack,
    ThreadEditStack,
    InviteContactsStack,
  },
  {
    headerMode: 'modal',
  },
);

export default createAppContainer(RootStack);
