import { getBaseUrl } from '../api/MattermostClient';

const getUserProfilePicture = (id, lastPictureUpdate = '') => {
  return `${getBaseUrl()}/api/v4/users/${id}/image?_=${lastPictureUpdate}`;
};

export default getUserProfilePicture;
