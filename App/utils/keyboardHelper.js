
import {Platform} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const behavior = isIOS ? 'position' : 'padding';

export const channelScreen = {
  offset: isIOS ? ifIphoneX(136, -108) : -160,
  behavior,
};

export const channelTab = {
  offset: isIOS ? ifIphoneX(88, 60) : -110,
  behavior,
};

export default {
  channelScreen,
  channelTab,
};
