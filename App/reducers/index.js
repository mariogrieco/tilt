import {combineReducers} from 'redux';
import watchlist from './wacthlist';
import history from './history';
import book from './book';
import miniChart from './miniChart';
import candle from './candle';
import depth from './depth';
import login from './login';
import signUp from './signup';
import modal from './modal';
import posts from './posts';
import users from './users';
import AppNavigation from './AppNavigation';
import emojis from './emojis';
import reactions from './reactions';
import files from './files';
import preferences from './preferences';
import displayUserProfile from './displayUserProfile';
import flagged from './flagged';
import archiveChannel from './archiveChannel';
import archivedChannels from './archivedChannels';
import statuses from './statuses';
import commands from './commands';
import reply from './reply';
import thread from './thread';
import channelsStat from './channelsStat';
import channelStatsGroup from './channelStatsGroup';
import lastViewed from './lastViewed';
import postActions from './postActions';
import channelJoinModalAlert from './channelJoinModalAlert';
import AdvancedSearch from './AdvancedSearch';
import search from './search';
import channelsPaginator from './channelsPaginator';
import codeVerification from './codeVerification';
import recovery from './Recovery';
import teams from './teams';
import channelsNames from './channelsNames';
import postMedia from './postMedia';
import sponsored from './sponsored';
import mapChannels from './MapChannels';
import myChannelsMap from './MyChannelsMap';
import adminCreators from './adminCreators';
import postCount from './postCount';
import repost from './repost';
import hashtagChannelsPaginator from './HashtagChannelsPaginator';
import themes from './themes';
import blockedUsers from './blockedUsers';
import channelsProps from './channelsProps';
import chartPopup from './chartPopupReducer';

export default combineReducers({
  flagged,
  watchlist,
  history,
  book,
  miniChart,
  candle,
  depth,
  login,
  signUp,
  modal,
  repost,
  posts,
  users,
  appNavigation: AppNavigation,
  emojis,
  reactions,
  files,
  preferences,
  displayUserProfile,
  archiveChannel,
  statuses,
  commands,
  reply,
  thread,
  channelsStat,
  channelStatsGroup,
  lastViewed,
  postActions,
  channelJoinModalAlert,
  advancedSearch: AdvancedSearch,
  search,
  channelsPaginator,
  codeVerification,
  recovery,
  teams,
  channelsNames,
  postMedia,
  sponsored,
  archivedChannels,
  mapChannels,
  myChannelsMap,
  adminCreators,
  postCount,
  hashtagChannelsPaginator,
  themes,
  // client4Error
  blockedUsers,
  channelsProps,
  chartPopup,
});
