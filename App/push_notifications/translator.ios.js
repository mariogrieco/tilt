import firebase from 'react-native-firebase';
import getUserProfilePicture from '../selectors/getUserProfilePicture';

const channel = new firebase.notifications.Android.Channel(
  'test-channel',
  'Test Channel',
  firebase.notifications.Android.Importance.Max,
).setDescription('My apps test channel');

firebase.notifications().android.createChannel(channel);


const eventsDispatched = (data, _messageId) => {
  const {type, sender_name, channel_name, message, badge, ack_id, sender_id} = data;
  if (type === 'message') {
    const notification = new firebase.notifications.Notification({
      sound: 'default',
      show_in_foreground: true,
    }).ios
      .setChannelId('test-channel')
      .setNotificationId(_messageId)
      .setTitle(sender_name)
      .setBody(message);

    // notification.android.setSmallIcon('ic_stat_name');
    // notification.ios.setColor('#3FB87F');

    notification.ios.setLargeIcon(getUserProfilePicture(sender_id));
    firebase.notifications().displayNotification(notification);
  }
};

export default eventsDispatched;
