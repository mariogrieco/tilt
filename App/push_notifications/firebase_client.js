import firebase from 'react-native-firebase';
import {RemoteMessage} from 'react-native-firebase';

class PushNotifications {
  hasPermission = false;
  messageListener = false;

  async hasPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.hasPermission = true;
    } else {
      this.hasPermission = false;
    }
    return this.hasPermission;
  }

  async requestpermissions() {
    try {
      await firebase.messaging().requestPermission();
      this.hasPermission = true;
    } catch (error) {
      this.hasPermission = false;
    }
    return this.hasPermission;
  }

  removeMessageListener() {
    this.messageListener();
    this.messageListener = null;
    return this.messageListener;
  }

  async setMessageListener(callback) {
    this.messageListener = firebase
      .messaging()
      .onMessage((message: RemoteMessage) => {
        callback(message);
      });
    return this.messageListener;
  }
}

export default PushNotifications;
