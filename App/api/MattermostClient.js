import {Client4} from 'mattermost-redux/client';
import axios from 'axios';

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
    return Promise.reject(err);
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

export default Client4;

export const setToken = token => {
  Client4.setToken(token);
};

export const getBaseUrl = () => Client4.getUrl();
