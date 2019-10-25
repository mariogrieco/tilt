import { Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const behavior = isIOS ? 'position' : '';


export const channelTab = {
  offset: ifIphoneX(136, 108),
  behavior
};

export const channelScreen = {
  offset: ifIphoneX(88, 60),
  behavior
};

export default {
  channelScreen,
  channelTab
};
