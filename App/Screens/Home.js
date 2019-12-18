import React from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import isEqual from 'lodash/isEqual';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import StyleSheet from 'react-native-extended-stylesheet';

import Feeds from '../components/Feeds';

import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';

import FollowingTimeline from '../components/FollowingTimeline';

const styles = StyleSheet.create({
  container: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  commonStyle: {
    borderColor: 'transparent',
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  activeStyle: {
    borderRadius: 8,
    elevation: 1,
    height: 30,
    padding: 2,
    margin: 2,
  },
  tabText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'SFProDisplay-Medium',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  activeTabText: {
    fontFamily: 'SFProDisplay-Semibold',
    textAlign: 'center',
  },
});

class Home extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => {
    const currentSegmentIndex = navigation.getParam('segment', 0);
    const handleTab = navigation.getParam('handleSegmentedTabPress', () => {});

    return {
      headerTitle: () => (
        <SegmentedControlTab
          values={['Feed', 'Following']}
          selectedIndex={currentSegmentIndex}
          onTabPress={handleTab}
          tabsContainerStyle={{
            ...styles.container,
            backgroundColor: screenProps.theme.segmentedControlBackgroundColor,
            borderColor: screenProps.theme.segmentedControlBackgroundColor,
          }}
          tabStyle={[styles.commonStyle]}
          activeTabStyle={{
            ...styles.commonStyle,
            ...styles.activeStyle,
            backgroundColor: screenProps.theme.primaryBackgroundColor,
          }}
          tabTextStyle={{
            ...styles.tabText,
            color: screenProps.theme.primaryTextColor,
          }}
          activeTabTextStyle={{
            ...styles.tabText,
            ...styles.activeTabText,
            color: screenProps.theme.primaryTextColor,
          }}
        />
      ),
      ...headerForScreenWithBottomLine({
        headerTintColor: screenProps.theme.headerTintColor,
        headerStyle: {
          backgroundColor: screenProps.theme.primaryBackgroundColor,
          borderBottomColor: screenProps.theme.borderBottomColor,
        },
      }),
    };
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setParams({
      onChangeText: this.searchSymbol,
      segment: 0,
      handleSegmentedTabPress: this.handleSegmentedTabPress,
    });
  }

  handleSegmentedTabPress = index => {
    const {navigation} = this.props;
    navigation.setParams({
      segment: index,
    });
  };

  renderSegment = () => {
    const {navigation} = this.props;
    const segment = navigation.getParam('segment');
    switch (segment) {
      case 0:
        return <Feeds />;
      case 1:
        return <FollowingTimeline />;
      default:
        <Feeds />;
    }
  };

  render() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        {this.renderSegment()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.themes[state.themes.current],
});

export default connect(mapStateToProps)(Home);
