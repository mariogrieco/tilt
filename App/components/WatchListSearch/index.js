import React from 'react';
import {connect} from 'react-redux';
import {Dimensions, Animated, View, TextInput, Image} from 'react-native';
import styles from '../HeaderHome/styles';

const SEARCH_ICON = require('../../../assets/themes/light/searchIcon/searchIcon.png');

const {width} = Dimensions.get('window');

class Search extends React.Component {
  state = {
    widthAnim: new Animated.Value(0), // Initial value for opacity: 0
    fadeAnim: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.parallel([
      Animated.timing(
        // Animate over time
        this.state.widthAnim, // The animated value to drive
        {
          toValue: Math.floor(width * 0.79), // Animate to opacity: 1 (opaque)
          duration: 300, // Make it take a while
        },
      ),
      Animated.timing(this.state.fadeAnim, {
        toValue: 1, // Animate to opacity: 1 (opaque)
        duration: 300,
      }), // Starts the animation
    ]).start();
  }

  render() {
    const {navigation, theme} = this.props;
    const {widthAnim, fadeAnim} = this.state;
    return (
      <Animated.View
        style={{
          width: widthAnim,
          opacity: fadeAnim,
          marginRight: 10,
          backgroundColor: theme.primaryBackgroundColor,
        }}>
        <View
          style={[
            styles.searchContainer,
            {backgroundColor: theme.secondaryBackgroundColor},
          ]}>
          <View style={{paddingRight: 6}}>
            <Image source={SEARCH_ICON} />
          </View>
          <View>
            <TextInput
              onChangeText={navigation.getParam('onChangeText', () => {})}
              placeholder="Search for a symbol"
              placeholderTextColor={theme.secondaryTextColor}
              style={[
                styles.searchText,
                {
                  backgroundColor: theme.secondaryBackgroundColor,
                  color: theme.primaryTextColor,
                },
              ]}
              autoCapitalize="characters"
              autoCompleteType="off"
              autoCorrect={false}
              autoFocus
              selectionColor="#17C491"
            />
          </View>
        </View>
      </Animated.View>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(mapStateToProps)(Search);
