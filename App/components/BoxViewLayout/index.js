import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
// import PropTypes from 'prop-types'
import {connect} from 'react-redux';
// import {NavigationActions} from 'react-navigation';
import GoBack from '../components/GoBack';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

import styles from './styles';

export class BoxViewLayout extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'BoxViewLayout',
    headerLeft: <GoBack onPress={() => navigation.goBack()} />,
    headerRight: (
      // eslint-disable-next-line react-native/no-inline-styles
      <TouchableOpacity style={{paddingHorizontal: 15, paddingVertical: 13}}>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontFamily: 'SFProDisplay-Bold',
            fontSize: 16,
            letterSpacing: 0.1,
            color: '#17C491',
          }}>
          {'Save'}
        </Text>
      </TouchableOpacity>
    ),
    ...headerForScreenWithBottomLine({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
    headerTitleStyle: {
      fontSize: 18,
      marginTop: 10,
      marginBottom: 10,
      fontFamily: 'SFProDisplay-Bold',
    },
  });
  render() {
    return (
      <View style={styles.container}>
        <Text> prop </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(index);
