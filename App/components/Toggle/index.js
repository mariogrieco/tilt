import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';

class Toggle extends React.Component {
  state = {
    current: 'left',
  };

  handleLeft = () => {
    const {onPress} = this.props;
    const {current} = this.state;

    if (current !== 'left') {
      this.setState({current: 'left'});
      onPress('left');
    }
  };

  handleRight = () => {
    const {onPress} = this.props;
    const {current} = this.state;

    if (current !== 'right') {
      this.setState({current: 'right'});
      onPress('right');
    }
  };

  render() {
    const {current} = this.state;
    const {leftLabel, rightLabel} = this.props;
    return (
      <View style={styles.toggle}>
        <TouchableOpacity onPress={this.handleLeft}>
          <Text
            style={[
              styles.toggleText,
              current === 'left'
                ? styles.toggleSelected
                : styles.toggleUnSelected,
            ]}>
            {`${leftLabel}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleRight}>
          <Text
            style={[
              styles.toggleText,
              current === 'right'
                ? styles.toggleSelected
                : styles.toggleUnSelected,
            ]}>
            {`${rightLabel}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

Toggle.defaultProps = {
  leftLabel: 'Price',
  rightLabel: 'Depth',
  onPress: () => {},
};

export default Toggle;
