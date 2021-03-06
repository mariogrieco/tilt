import {Client4} from 'mattermost-redux/client';
import axios from 'axios';
import queryString from 'query-string';

export let baseUrl;
export let baseServicesUrl;
export let socketURL;
export let server_id;

const IS_DEV_ENV = process.env.NODE_ENV === 'development';

if (IS_DEV_ENV) {
  baseUrl = 'https://staging.tiltchat.com';
  baseServicesUrl = 'https://staging.tiltchat.com/services';
  socketURL = 'wss://staging.tiltchat.com/api/v4/websocket';
} else {
  baseUrl = 'https://community.tiltchat.com';
  baseServicesUrl = 'https://community.tiltchat.com/services';
  socketURL = 'wss://community.tiltchat.com/api/v4/websocket';
}

Client4.setUrl(baseUrl);
Client4.setIncludeCookies(true);

Client4.getSymbolTicket = async symbol_name => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/symbol-data/${symbol_name}`,
    );
    return data;
  } catch (err) {
    console.log('err:', err);
    return Promise.reject(err);
  }
};

Client4.searchChannels = async terms => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/channel/search/${terms}`,
    );
    return data;
  } catch (ex) {
    return [];
  }
};

Client4.searchIexChannels = async terms => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/channel/search/${terms}?is_iex=true`,
    );
    return data;
  } catch (ex) {
    return [];
  }
};

Client4.searchBinanceChannels = async terms => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/channel/search/${terms}?is_binance=true`,
    );
    return data;
  } catch (ex) {
    return [];
  }
};

Client4.getMyChannels = async user_id => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/channel/my?user_id=${user_id}`,
    );
    return data;
  } catch (er) {
    return Promise.reject(er);
  }
};

Client4.getKlines = async (symbol, interval, startTime) => {
  try {
    const url = `${baseServicesUrl}/symbol-data/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}`;
    const data = await axios.get(url);
    return data;
  } catch (ex) {
    return {data: null};
  }
};

Client4.getSymbolPercentChange = symbol_name => {
  return axios.get(
    `${baseServicesUrl}/symbol-data/${symbol_name}/percent-change`,
  );
};

Client4.createUserOld = ({
  email,
  username,
  password,
  phone,
  callingCode,
  firstName,
  lastName,
}) => {
  return axios.post(`${baseServicesUrl}/users/v2`, {
    user: {
      email,
      username,
      password,
      phone,
      callingCode,
      firstName,
      lastName,
    },
  });
};

Client4.getSponsored = async () => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/sponsored`);
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getAllUsers = async () => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/users`);
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getAdminCreators = async () => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/admin-creators`);
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getReactionsForUser = async userID => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/reactions/${userID}`);
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getPostCountForUser = async (teamId, userID) => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/posts/${userID}/count`);
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getChannel = async id => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/channel?id=${id}`);
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getChannelByNameService = async (name, delete_at = 0) => {
  try {
    name = name.length < 2 ? `${name}11` : name;
    const {data} = await axios.get(
      `${baseServicesUrl}/channel?name=${name}&delete_at=${delete_at}`,
    );
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getHashtagChannels = async (page, per_page) => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/channel/public?page=${page}&per_page=${per_page}`,
    );
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.addOrRemoveOneBlockedUser = async (user_id, blocking_user_id) => {
  try {
    const {data} = await axios.post(`${baseServicesUrl}/blocked-user`, {
      user_id,
      blocking_user_id,
    });
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getBlokedUsers = async user_id => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/blocked-user/${user_id}`,
    );
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getUserFollowers = async user_id => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/followers/${user_id}`);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

Client4.getUserFollowings = async user_id => {
  try {
    const {data} = await axios.get(`${baseServicesUrl}/following/${user_id}`);
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

Client4.followUser = async ({user_id, following_id}) => {
  try {
    const {data} = await axios({
      method: 'POST',
      url: `${baseServicesUrl}/follow`,
      data: {user_id, following_id},
    });
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

Client4.unfollowUser = async ({user_id, following_id}) => {
  try {
    const {data} = await axios({
      method: 'DELETE',
      url: `${baseServicesUrl}/follow`,
      data: {user_id, following_id},
    });
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

Client4.getFollowTimeLine = async (user_id, page, perPage) => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/following/posts/${user_id}?page=${page}&per_page=${perPage}`,
    );
    return data;
  } catch (err) {
    throw err;
  }
};

Client4.getChannelsBy = async (query, filter_ids) => {
  try {
    const body = {};
    if (filter_ids) {
      body.filter_ids = filter_ids.join(',');
    }
    const {data} = await axios.post(
      `${baseServicesUrl}/channel/filter_by?${queryString.stringify(query)}`,
      body,
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

Client4.getStocksMarketLosersList = async () => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/symbol-data/stocks/market/list/losers`,
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

Client4.getStocksMarketGainersList = async () => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/symbol-data/stocks/market/list/gainers`,
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

Client4.getStocksMarketMostactiveList = async () => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/symbol-data/stocks/market/list/mostactive`,
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

Client4.getMemberCount = async ids => {
  try {
    const {data} = await axios.post(`${baseServicesUrl}/channel/member_count`, {
      ids: ids.join(','),
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

Client4.getChannelPreview = async channel_id => {
  try {
    const {data} = await axios.get(
      `${baseServicesUrl}/channel/preview/${channel_id}`,
    );
    return data;
  } catch (ex) {
    return Promise.reject(ex);
  }
};

Client4.getNews = async (symbol = '') => {
  if (symbol === 3) {
    symbol = symbol.replace('11', '');
  }
  try {
    const {data} = await axios.get(`${baseServicesUrl}/news/${symbol}`);
    return data;
  } catch (err) {
    return Promise.resolve([]);
  }
};

export default Client4;

export const setToken = token => {
  Client4.setToken(token);
};

export const getBaseUrl = () => Client4.getUrl();
