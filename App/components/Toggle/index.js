import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';

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
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.toggle,
          {backgroundColor: theme.secondaryBackgroundColor},
        ]}>
        <TouchableOpacity onPress={this.handleLeft}>
          <Text
            style={[
              styles.toggleText,
              current === 'left'
                ? [styles.toggleSelected, {color: theme.primaryBackgroundColor}]
                : [styles.toggleUnSelected, {color: theme.primaryTextColor}],
            ]}>
            {`${leftLabel}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.handleRight}>
          <Text
            style={[
              styles.toggleText,
              current === 'right'
                ? [styles.toggleSelected, {color: theme.primaryBackgroundColor}]
                : [styles.toggleUnSelected, {color: theme.primaryTextColor}],
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

const mapStateToProps = ({themes}) => ({
  theme: themes[themes.current],
});

export default connect(mapStateToProps)(Toggle);
