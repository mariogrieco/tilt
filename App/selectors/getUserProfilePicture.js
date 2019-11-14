import {getBaseUrl} from '../api/MattermostClient';
const getUserProfilePicture = (id, lastPictureUpdate = '0') => {
  const url = `${getBaseUrl()}/api/v4/users/${id}/image?_=${lastPictureUpdate}`;
  return url;
};

export default getUserProfilePicture;
