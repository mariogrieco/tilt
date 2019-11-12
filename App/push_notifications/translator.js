import firebase from 'react-native-firebase';

const eventsDispatched = (data, _messageId) => {
  const {type, sender_name, channel_name, message, badge, ack_id} = data;

  if (type === 'message') {
    const notification = new firebase.notifications.Notification({
      sound: 'default',
      show_in_foreground: true,
    }).android
      // .setPriority(firebase.notifications.Android.Priority.High)
      .setChannelId(ack_id)
      .setNotificationId(_messageId)
      .setTitle(sender_name)
      .setBody(message)
      .setData({
        key1: message,
        key2: channel_name,
      });
    firebase.notifications().displayNotification(notification);
  }
};

export default eventsDispatched;
