import axios from 'axios';
import {baseUrl, server_id} from '../api/MattermostClient';
export const TYPES = {
  PRIVATE_MESSAGE: 'PRIVATE_MESSAGE',
  PUBLIC_MESSAGE: 'PUBLIC_MESSAGE',
  REACTION_ADDED: 'REACTION_ADDED',
  REACTION_REMOVED: 'REACTION_REMOVED',
  POST_EDITED: 'POST_EDITED',
  ADDED_TO_CHANNEL: 'ADDED_TO_CHANNEL',
  REMOVE_FROM_CHANNEL: 'REMOVE_FROM_CHANNEL',
};

export const PUSH_NOTIFICATIONS_END = `${baseUrl}/push-notifications/api/v1/send_push`;

export class Sender {
  config = {
    device_id: null,
    platform: 'android',
    badge: 1,
    server_id,
  };

  setDeviceId(device_id) {
    this.config.device_id = device_id;
  }

  getAndApplyProps(props = {}) {
    return {
      ...this.config,
      ...props,
    };
  }

  sendPrivateMessage(channel_id, message) {
    return axios.post({
      url: PUSH_NOTIFICATIONS_END,
      body: this.getAndApplyProps({
        channel_id,
        message,
        type: TYPES.PRIVATE_MESSAGE,
      }),
    });
  }

  sendMessageToChannel(channel_id, message) {
    return axios.post({
      url: PUSH_NOTIFICATIONS_END,
      body: this.getAndApplyProps({
        channel_id,
        message,
        type: TYPES.PUBLIC_MESSAGE,
      }),
    });
  }

  sendReactionAdded() {};
  sendReactionRemoved() {};
  sendPostEdited() {};
  sendAddedToChannel() {};
  sendRemoveFromChannel() {};
};
