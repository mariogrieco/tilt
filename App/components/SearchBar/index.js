import React from 'react';
import {TextInput, Animated, Dimensions, View, Image} from 'react-native';
import styles from './styles';

const {width} = Dimensions.get('window');
const SEARCH_ICON = require('../../../assets/themes/light/searchIcon/searchIcon.png');

class SearchBar extends React.Component {
  state = {
    widthAnim: new Animated.Value(0), // Initial value for opacity: 0
    fadeAnim: new Animated.Value(0),
  };

  componentDidMount() {
    const {widthAnim, fadeAnim} = this.state;
    const {growPercentage} = this.props;
    Animated.parallel([
      Animated.timing(
        // Animate over time
        widthAnim, // The animated value to drive
        {
          toValue: Math.floor(width * growPercentage), // Animate to opacity: 1 (opaque)
          duration: 300, // Make it take a while
        },
      ),
      Animated.timing(fadeAnim, {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 300,
      }), // Starts the animation
    ]).start();
  }

  render() {
    const {
      onChangeText,
      inputStyle,
      containerStyle,
      placeholderText,
      placeholderTextColor,
      inputValue,
      onSelectionChange,
      handleRef,
    } = this.props;
    const {widthAnim, fadeAnim} = this.state;
    return (
      <Animated.View
        style={[
          {
            width: widthAnim,
            opacity: fadeAnim,
            height: 40,
          },
          containerStyle,
        ]}>
        <View style={styles.searchContainer}>
          <View style={{marginRight: 6}}>
            <Image source={SEARCH_ICON} />
          </View>
          <TextInput
            ref={handleRef}
            onChangeText={onChangeText}
            style={[styles.input, inputStyle]}
            placeholder={placeholderText}
            placeholderTextColor={placeholderTextColor}
            defaultValue=""
            onSelectionChange={onSelectionChange}
            value={inputValue}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor="#17C491"
          />
        </View>
      </Animated.View>
    );
  }
}

SearchBar.defaultProps = {
  inputStyle: {},
  containerStyle: {},
  placeholderText: '',
  placeholderTextColor: '#000',
  growPercentage: 0.5,
  onChangeText: () => {},
  inputValue: '',
};

export default SearchBar;
