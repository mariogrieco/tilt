// @flow
// Optional flow type
// import {RemoteMessage} from 'react-native-firebase';
import translator from './translator';

export default async msg => {
  // handle your message
  console.log(msg);
  return Promise.resolve(translator(msg.data, msg.messageId));
};
