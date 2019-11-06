import {Dimensions} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

const {width} = Dimensions.get('window');

let rem = 12;

if (width > 768) {
  rem = 42;
} else if (width > 414) {
  rem = 24;
} else if (width > 375) {
  rem = 16;
} else if (width > 320) {
  rem = 14;
}

export const defaultConfig = {
  $rem: rem,
  $textColor: '#0e141e',
  $textColorLight: '#0e141e',
  $green: '#17C491',
  $red: '#FC3E30',
  $borderRadius: '1.375rem',
};

export default theme => StyleSheet.build(theme);
