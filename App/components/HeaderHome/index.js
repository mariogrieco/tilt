/* eslint-disable react/no-multi-comp */
import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';

// const MENU_IMAGE = require('../../../assets/themes/light/menu/menu.png');
const SEARCH = require('../../../assets/themes/light/search/search.png');
const SEARCH_ICON = require('../../../assets/themes/light/searchIcon/searchIcon.png');

const {width} = Dimensions.get('window');

// export const HeaderLeft = (props) => {
//   const { navigation } = props;
//   return (
//     <View style={styles.searchContainer}>
//       <Image
//         source={SEARCH_ICON}
//         style={{
//           paddingLeft: 20, paddingRight: 8, paddingVertical: 5
//         }}
//       />
//       <View>
//         <TextInput
//           onChangeText={navigation.getParam('onChangeText', () => {})}
//           style={styles.searchText}
//           placeholder="Search for a symbol"
//           placeholderTextColor="#8E8E95"
//         />
//       </View>
//     </View>
//   );
// };

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
    const {navigation} = this.props;
    const {widthAnim, fadeAnim} = this.state;

    return (
      <Animated.View
        style={{
          width: widthAnim,
          opacity: fadeAnim,
          marginRight: 10,
        }}>
        <View style={styles.searchContainer}>
          <View style={{paddingRight: 6}}>
            <Image source={SEARCH_ICON} />
          </View>
          <View>
            <TextInput
              onChangeText={navigation.getParam('onChangeText', () => {})}
              placeholder="Search for a symbol"
              placeholderTextColor="#8E8E95"
              style={styles.searchText}
              autoCapitalize="characters"
              autoCompleteType="off"
              autoCorrect={false}
              autoFocus
            />
          </View>
        </View>
      </Animated.View>
    );
  }
}

class HeaderRight extends React.Component {
  state = {
    isSearching: false,
  };

  handleSearch = () => {
    const {navigation} = this.props;
    this.setState(prevState => ({isSearching: !prevState.isSearching}));
    navigation.setParams({
      title: '',
    });
  };

  handleCancel = () => {
    const {navigation} = this.props;
    this.setState(prevState => ({isSearching: !prevState.isSearching}));
    navigation.setParams({
      title: 'All Cryptos',
    });
    navigation.getParam('onChangeText')('');
  };

  render() {
    const {isSearching} = this.state;
    const {navigation} = this.props;

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {isSearching ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Search navigation={navigation} />
            <TouchableOpacity
              style={styles.headerRight}
              onPress={this.handleCancel}>
              <Text
                style={{
                  color: '#0E141E',
                  fontFamily: 'SFProDisplay-Medium',
                  fontSize: 16,
                  letterSpacing: 0.1,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.headerRight}
            onPress={this.handleSearch}>
            <Image source={SEARCH} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({login}) => ({login});

export default connect(
  mapStateToProps,
  null,
)(HeaderRight);
