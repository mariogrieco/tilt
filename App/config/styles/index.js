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

export const DarkTheme = {
  $theme: 'dark',
  $rem: rem,
  $textColor: '#FFFF',
  $textColorLight: '#585c63',
  $green: '#17C491',
  $red: '#FC3E30',
  $borderRadius: '1.375rem',
  $backgroundColor: '#040D14',
  $buttonTextColor: '#040d14',
  $borderBottomColor: '#353942',
  $headerTintColor: '#FFF',
};

export const LightTheme = {
  $theme: 'light',
  $rem: rem,
  $textColor: '#0e141e',
  $textColorLight: '#585c63',
  $green: '#17C491',
  $red: '#FC3E30',
  $borderRadius: '1.375rem',
  $backgroundColor: '#FFFF',
  $buttonTextColor: '#FFF',
  $borderBottomColor: '#DCDCDC',
  $headerTintColor: '#0E141E',
};

export default theme => StyleSheet.build(theme);
