import {Client4} from 'mattermost-redux/client';
import axios from 'axios';

export let baseUrl = 'https://community.tiltchat.com';
export let baseServicesUrl = 'https://community.tiltchat.com/services';
export let socketURL = 'wss://community.tiltchat.com/api/v4/websocket';

// const IS_DEV_ENV = process.env.NODE_ENV === 'development';

// if (IS_DEV_ENV) {
//   console.log('IS_DEV_ENV!!');
//   baseUrl = 'https://staging.tiltchat.com';
//   baseServicesUrl = 'https://staging.tiltchat.com/services';
//   socketURL = 'wss://staging.tiltchat.com/api/v4/websocket';
// }

Client4.setUrl(baseUrl);
Client4.setIncludeCookies(true);

Client4.createUser = ({
  email,
  username,
  password,
  phone,
  firstName,
  lastName,
}) => {
  return axios.post(`${baseServicesUrl}/users`, {
    user: {
      email,
      username,
      password,
      phone,
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

export default Client4;

export const setToken = token => {
  Client4.setToken(token);
};

export const getBaseUrl = () => Client4.getUrl();
