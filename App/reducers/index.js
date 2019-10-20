import { combineReducers } from 'redux';
import watchlist from './wacthlist';
import history from './history';
import book from './book';
import miniChart from './miniChart';
import candle from './candle';
import depth from './depth';
import login from './login';
import signUp from './signup';
import modal from './modal';
import channels from './channels';
import posts from './posts';
import users from './users';
import AppNavigation from './AppNavigation';
import myChannels from './myChannels';
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
import thread from './thread'
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
  channels, // Al these Channels for existing teams.
  myChannels,
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
  archivedChannels
  // client4Error
});
