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
    try {
      const notification = new firebase.notifications.Notification({
        sound: 'default',
        show_in_foreground: true,
      }).android
        .setChannelId('test-channel')
        .setNotificationId(_messageId)
        .setLargeIcon(getUserProfilePicture(sender_id))
        .setTitle(sender_name)
        .setBody(message)
        .setData({
          key1: message,
          key2: channel_name,
        });
      notification.android.setSmallIcon('ic_stat_name');
      notification.android.setColor('#3FB87F');
      firebase.notifications().displayNotification(notification);
      console.log('data: android');
    } catch (err) {
      console.log(err);
    }
  }
};

export default eventsDispatched;
