import React from 'react';
import {
  View,
  Text,
  TextInput
} from 'react-native';
import styles from './styles';


export const Title = ({ title, containerStyle, textStyle }) => (
  <View style={[styles.fieldContainer, styles.titleContainer, containerStyle]}>
    <Text style={[styles.titleText, textStyle]}>
      {title}
    </Text>
  </View>
);

export const Description = ({ description, containerStyle, textStyle }) => (
  <View style={[styles.fieldContainer, styles.descriptionContainer, containerStyle]}>
    <Text style={[styles.descriptionText, textStyle]}>
      {description}
    </Text>
  </View>
);

export const Input = ({ onChangeText, placeHolder, style, value}) => (
  <TextInput
    value={value}
    placeholder={placeHolder}
    onChangeText={onChangeText}
    multiline
    style={[styles.fieldContainer, styles.input, style]}
    placeholderTextColor="#8E8E95"
  />
);

const CreateChannelField = ({ style, children }) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);


export default CreateChannelField;
