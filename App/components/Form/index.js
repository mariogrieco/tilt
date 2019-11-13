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
import isEqual from 'lodash/isEqual';

import Terms from '../Terms';
import styles from './styles';

class Form extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  render() {
    const {
      children,
      showText,
      textButton,
      linkText,
      navigationToPhoneNumber,
      navigationTo,
      keyboardVerticalOffset,
      canSend,
      showTerms,
    } = this.props;
    const {theme} = this.props;
    return (
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
            {showTerms && <Terms />}
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
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(Form);
