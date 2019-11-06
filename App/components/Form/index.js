import React from 'react';
import {connect} from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import styles from './styles';

const Form = ({
  children,
  showText,
  textButton,
  linkText,
  navigationToPhoneNumber,
  navigationTo,
  keyboardVerticalOffset,
  canSend,
  theme,
}) => (
  <SafeAreaView style={{flex: 1, marginBottom: 10}}>
    <View style={{flex: 1}}>
      {children}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={Platform.OS === 'ios' ? 'position' : undefined}>
        {showText && (
          <TouchableOpacity onPress={navigationToPhoneNumber}>
            <Text style={styles.forgotPassword}>{linkText}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          disabled={!canSend}
          style={canSend ? {} : styles.disabled}
          onPress={canSend ? navigationTo : () => ({})}>
          <Text style={[styles.button, {color: theme.buttonTextColor}]}>
            {textButton}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  </SafeAreaView>
);

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(Form);
