import {Client4} from 'mattermost-redux/client';
import axios from 'axios';

export const baseUrl = 'https://community.tiltchat.com';
export const baseServicesUrl = 'https://community.tiltchat.com/services';

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

export default Client4;

export const setToken = token => {
  Client4.setToken(token);
};

export const getBaseUrl = () => Client4.getUrl();
