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
import postCount from './postCount';
import repost from './repost';
import hashtagChannelsPaginator from './HashtagChannelsPaginator';
import themes from './themes';
import blockedUsers from './blockedUsers';
import channelsProps from './channelsProps';
import chartPopup from './chartPopupReducer';
import feeds from './feeds';
import stockTab from './StockTab';
import news from './news';

import all_channels_tab_paginator from './all_channels_tab_paginator';
import new_channels_tab_paginator from './new_channels_tab_paginator';
import stocks_channels_tab_paginator from './stocks_channels_tab_paginator';
import trending_channels_tab_paginator from './trending_channels_tab_paginator';

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
  stockTab,
  postCount,
  hashtagChannelsPaginator,
  themes,
  blockedUsers,
  channelsProps,
  chartPopup,
  feeds,
  all_channels_tab_paginator,
  new_channels_tab_paginator,
  stocks_channels_tab_paginator,
  trending_channels_tab_paginator,
  news,
});
