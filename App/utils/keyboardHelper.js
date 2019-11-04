import { Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const behavior = isIOS ? 'padding' : 'padding';


export const channelScreen = {
  offset: ifIphoneX(-160, -160),
  behavior
};

export const channelTab = {
  offset: ifIphoneX(-110, -110),
  behavior
};

export default {
  channelScreen,
  channelTab
};
