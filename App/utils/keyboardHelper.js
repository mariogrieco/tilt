import {Platform} from 'react-native';
import {ifIphoneX} from 'react-native-iphone-x-helper';

const isIOS = Platform.OS === 'ios';
const behavior = isIOS ? 'position' : 'position';

export const channelTab = {
  offset: isIOS ? ifIphoneX(136, 108) : -90,
  behavior,
};

export const channelScreen = {
  offset: isIOS ? ifIphoneX(88, 60) : -140,
  behavior,
};

export default {
  channelScreen,
  channelTab,
};

