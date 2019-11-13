import firebase from 'react-native-firebase';
import getUserProfilePicture from '../selectors/getUserProfilePicture';
import moment from 'moment';

const channel = new firebase.notifications.Android.Channel(
  'test-android-channel',
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
        .setChannelId('test-android-channel')
        .setNotificationId(_messageId)
        .setTitle(sender_name)
        .setBody(message);

      notification.android.setLargeIcon(
        getUserProfilePicture(sender_id, moment().unix()),
      );

      notification.android.setSmallIcon('ic_stat_name');
      notification.android.setColor('#3FB87F');

      firebase.notifications().displayNotification(notification);
      console.log('data: android', data);
    } catch (err) {
      console.log(err);
    }
  }
};

export default eventsDispatched;
