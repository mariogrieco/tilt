import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';
import isEqual from 'lodash/isEqual';
import StyleSheet from 'react-native-extended-stylesheet';
import GoBack from '../components/GoBack';
import StockNewsLayout from '../components/StockNewsLayout';
import ChannelOptionalView from '../components/ChannelOptionalView';
import StockChart from '../components/StockChart';
import {NavigationActions} from 'react-navigation';

const ChannelTab = () => <ChannelOptionalView />;

const styles = StyleSheet.create({
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
  },
  indicator: {
    backgroundColor: '#17C491',
    height: 3,
  },
  searchContainer: {
    marginLeft: 0,
  },
  cancel: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 16,
    letterSpacing: 0.1,
  },
});

const {width} = Dimensions.get('window');

export class StockRoom extends Component {
  state = {
    index: 0,
    routes: [
      {key: 'chat', title: 'CHAT'},
      {key: 'chart', title: 'CHART'},
      {key: 'news', title: 'NEWS'},
    ],
    searchValue: '',
  };

  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.getParam('title', ''),
    ...headerForScreenWithTabs({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
  });

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  render() {
    const {theme} = this.props;
    return (
      <React.Fragment>
        <TabView
          navigationState={{...this.state}}
          renderScene={SceneMap({
            news: StockNewsLayout,
            chart: StockChart,
            chat: ChannelTab,
          })}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={[
                styles.tabBar,
                {
                  backgroundColor: theme.primaryBackgroundColor,
                  borderBottomColor: theme.borderBottomColor,
                },
              ]}
              labelStyle={styles.label}
              indicatorStyle={styles.indicator}
              activeColor="#17C491"
              inactiveColor="#585C63"
            />
          )}
          //swipeEnabled={false}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  // // dispatchSelectedSymbol: selectedSymbol,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StockRoom);
