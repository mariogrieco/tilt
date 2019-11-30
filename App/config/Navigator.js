import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import ThemeTabBar from '../components/ThemeTabBar';
import TabBarIcon from '../components/TabBarIcon';
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
import TermsWeb from '../Screens/TermsWeb';
import BlockUser from '../Screens/BlockUser';
import Themes from '../Screens/Themes';
import NewChannels from '../Screens/NewChannels';
import TrendingChannels from '../Screens/TrendingChannels';
import Stocks from '../Screens/Stocks';
import Cryptos from '../Screens/Cryptos';
import StockRoom from '../Screens/StockRoom';
import All from '../Screens/All';

const HomeStack = createStackNavigator(
  {
    Home,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const CryptoRoomStack = createStackNavigator(
  {
    CryptoRoom,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const StockRoomStack = createStackNavigator(
  {
    StockRoom,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const SignUpStack = createStackNavigator(
  {
    SignUp,
    LogIn,
    CreateAccount,
    TermsWeb,
    PhoneNumber,
    Verification,
    PasswordReset,
    Recovery,
  },
  {
    // headerMode: 'none',
    headerLayoutPreset: 'center',
  },
);

const LoggedInTab = createStackNavigator(
  {
    LoggedIn,
  },
  {
    // headerMode: 'none',
    headerLayoutPreset: 'center',
  },
);

const PublicChatStack = createStackNavigator(
  {
    PublicChat,
    CreateChannel,
    NewChannels,
    TrendingChannels,
    Stocks,
    Cryptos,
    All,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const MessagesStack = createStackNavigator(
  {
    Messages,
  },
  {
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
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused}) => {
        const {routeName} = navigation.state;
        return <TabBarIcon routeName={routeName} focused={focused} />;
      },
    }),
    tabBarComponent: props => <ThemeTabBar {...props} />,
    tabBarOptions: {
      labelStyle: {
        fontSize: 18,
        letterSpacing: 0.1,
      },
      showIcon: true,
      showLabel: false,
    },
  },
);

const LoggedInMenuStack = createStackNavigator(
  {
    LoggedInMenu,
    BlockUser,
    EditProfile,
    Themes,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const MemberStack = createStackNavigator(
  {
    MemberProfile,
  },
  {
    headerLayoutPreset: 'center',
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
  },
);

const ThreadStack = createStackNavigator(
  {
    Thread,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const ThreadEditStack = createStackNavigator(
  {
    ThreadEdit,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const InviteContactsStack = createStackNavigator(
  {
    InviteContacts,
  },
  {
    headerLayoutPreset: 'center',
  },
);

const RootStack = createStackNavigator(
  {
    SignUpStack,
    Root: TabBarPrincipal,
    StockRoom: StockRoomStack,
    Room: CryptoRoomStack,
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
