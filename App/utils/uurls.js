import {
  Linking,
} from 'react-native';

export const handleUrlPress = async (text) => {
  if (text.includes('www.') && (!text.includes('http'))) {
    const httpToUrl = `https://${text}`;
    try {
      await Linking.openURL(httpToUrl);
    } catch (err) {
      alert(err);
    }
  } else {
    try {
      await Linking.openURL(text);
    } catch (err) {
      alert(err);
    }
  }
};

export const handleConvertedUrlPress = async (text) => {
  if (text.includes('@')) {
    const emailUrl = `mailto:${text}`;
    try {
      await Linking.openURL(emailUrl);
    } catch (err) {
      alert(err);
    }
  } else {
    const httpToUrl = `https://${text}`;
    try {
      await Linking.openURL(httpToUrl);
    } catch (err) {
      alert(err);
    }
  }
};

export const handleEmailPress = async (text) => {
  const emailUrl = `mailto:${text}`;
  try {
    await Linking.openURL(emailUrl);
  } catch (err) {
    alert(err);
  }
};
