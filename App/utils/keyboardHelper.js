import { Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const behavior = isIOS ? 'position' : 'padding';


export const channelScreen = {
  offset: ifIphoneX(136, -160),
  behavior,
};

export const channelTab = {
  offset: ifIphoneX(88, -110),
  behavior,
};

export default {
  channelScreen,
  channelTab
};

