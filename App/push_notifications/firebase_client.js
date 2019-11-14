import firebase from 'react-native-firebase';

class PushNotification {
  hasPermission;
  messageListener;

  constructor() {
    this.hasPermission = true;
    this.messageListener = false;
  }

  async requirePermission(callback) {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.hasPermission = true;
    } else {
      this.hasPermission = false;
      await callback();
    }
  }

  async requestPermissions() {
    try {
      await firebase.messaging().requestPermission();
      this.hasPermission = true;
    } catch (error) {
      this.hasPermission = false;
    }
    return this.hasPermission;
  }

  removeMessageListener() {
    if (this.messageListener) {
      this.messageListener();
    }
    this.messageListener = null;
    return this.messageListener;
  }

  async setMessageListener(callback) {
    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(message);
      callback(message);
    });
    return this.messageListener;
  }
}

let pushNotificationsInstance = null;

export default (() => {
  if (!pushNotificationsInstance) {
    pushNotificationsInstance = new PushNotification();
  }
  return pushNotificationsInstance;
})();
