import React, {Component, Fragment} from 'react';
import {Dimensions, TouchableOpacity, Image, View} from 'react-native';
import {connect} from 'react-redux';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';
import isEqual from 'lodash/isEqual';
import StyleSheet from 'react-native-extended-stylesheet';
import GoBack from '../components/GoBack';
import StockNewsLayout from '../components/StockNewsLayout';
import ChannelOptionalView from '../components/ChannelOptionalView';
import StockChart from '../components/StockChart';
import ChannelHeader from '../components/ChannelHeader';
import {NavigationActions} from 'react-navigation';
import {withNavigation} from 'react-navigation';

import assets from '../config/themeAssets/assets';

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
    // title: navigation.getParam('title', ''),
    ...headerForScreenWithTabs({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
    headerLeft: (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
        <ChannelHeader
          name={navigation.getParam('title', '')}
          create_at={navigation.getParam('create_at', '')}
          members={navigation.getParam('members', '')}
          fav={navigation.getParam('fav', '')}
          pm={navigation.getParam('pm', '')}
          isAdminCreator={navigation.getParam('isAdminCreator', '')}
        />
      </View>
    ),
    headerRight: (
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Fragment>
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
            style={{paddingVertical: 10, paddingLeft: 20, paddingRight: 5}}
            onPress={() => navigation.navigate('AdvancedSearch')}>
            <Image source={assets[screenProps.themeName].SEARCH} />
          </TouchableOpacity>
          <TouchableOpacity
            // eslint-disable-next-line react-native/no-inline-styles
            style={{paddingVertical: 10, paddingLeft: 20, paddingRight: 15}}
            onPress={() => navigation.navigate('ChannelInfo')}>
            <Image source={assets[screenProps.themeName].GEAR} />
          </TouchableOpacity>
        </Fragment>
      </View>
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

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(StockRoom),
);
