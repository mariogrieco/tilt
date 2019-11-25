import React from 'react';
import {View, Text, TextInput} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';

export const Title = ({title, containerStyle, textStyle}) => (
  <View style={[styles.fieldContainer, styles.titleContainer, containerStyle]}>
    <Text style={[styles.titleText, textStyle]}>{title}</Text>
  </View>
);

export const Description = ({description, containerStyle, textStyle}) => (
  <View
    style={[
      styles.fieldContainer,
      styles.descriptionContainer,
      containerStyle,
    ]}>
    <Text style={[styles.descriptionText, textStyle]}>{description}</Text>
  </View>
);

export const Input = ({onChangeText, placeHolder, style, value}) => (
  <TextInput
    value={value}
    placeholder={placeHolder}
    onChangeText={onChangeText}
    multiline
    style={[styles.fieldContainer, styles.input, style]}
    placeholderTextColor="#8E8E95"
    autoCapitalize="none"
    selectionColor="#17C491"
    keyboardAppearance="dark"
  />
);

const CreateChannelField = ({style, children, theme}) => (
  <View
    style={[
      styles.container,
      style,
      {backgroundColor: theme.secondaryBackgroundColor},
    ]}>
    {children}
  </View>
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(CreateChannelField);
