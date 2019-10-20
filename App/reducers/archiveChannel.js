import {ARCHIVE_CHANNEL_ACTIVE} from '../actions/archiveChannel';

const initialState = {
  archiveChannelActive: false,
};

const archiveChannel = (state = initialState, action) => {
  switch (action.type) {
    case ARCHIVE_CHANNEL_ACTIVE:
      return {
        ...action.payload,
        archiveChannel: true,
      };
    default:
      return state;
  }
};

export default archiveChannel;
