import React, {PureComponent} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';

const CANCEL = require('../../../assets/themes/light/cancel/cancel.png');

class NewMessageLabel extends PureComponent {
  render() {
    const {onPress, onClose, length, theme} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.textContainer} onPress={onPress}>
          <Text style={[styles.span, {color: theme.primaryBackgroundColor}]}>
            {length} New Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Image source={CANCEL} />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(NewMessageLabel);
