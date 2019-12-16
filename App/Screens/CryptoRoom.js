import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {getChannelByName} from '../actions/channels';
import {setActiveFocusChannel} from '../actions/AppNavigation';
import GoBack from '../components/GoBack';
import Book from '../components/Book';
import History from '../components/History';
import Stat from '../components/Stat';
import Chart from '../components/Chart';
import ChannelOptionalView from '../components/ChannelOptionalView';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
import ChannelHeader from '../components/ChannelHeader';
import parser from '../utils/parse_display_name';
import assets from '../config/themeAssets/assets';

// const ChannelTab = () => <Channel displayAs="tab" />;
const ChannelTab = () => <ChannelOptionalView />;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    backgroundColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  label: {
    // color: '#0E141E',
    fontSize: 12,
    fontFamily: 'SFProDisplay-Bold',
  },
  indicator: {
    backgroundColor: '#17C491',
    // backgroundColor: 'rgba(16, 115, 240, 0.75)',
    height: 3,
  },
});

class CryptoRoom extends React.PureComponent {
  static navigationOptions = ({navigation, screenProps}) => ({
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
      </View>
    ),
    ...headerForScreenWithBottomLine({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
  });

  state = {
    index: 0,
    routes: [
      {key: 'chat', title: 'CHAT'},
      {key: 'charts', title: 'CHART'},
      {key: 'stat', title: 'STATS'},
      {key: 'book', title: 'BOOK'},
      {key: 'history', title: 'TRADES'},
    ],
  };

  async componentWillMount() {
    this.props.navigation.setParams({
      title: this.props.selectedSymbol.symbol,
    });
    const {selectedSymbol, getChannelByName, channels, myChannels} = this.props;

    const notInbutFound = channels.find(
      channel => parser(channel.display_name) === parser(selectedSymbol.symbol),
    );
    const foundOnMy = myChannels.find(
      channel => parser(channel.display_name) === parser(selectedSymbol.symbol),
    );
    if (foundOnMy) {
      this.props.setActiveFocusChannel(foundOnMy.id);
      return null;
    }

    if (notInbutFound) {
      this.props.setActiveFocusChannel(notInbutFound.id);
      return null;
    }

    try {
      const result = await getChannelByName(selectedSymbol.symbol);
      if (result) {
        this.props.setActiveFocusChannel(result.id);
      }
    } catch (err) {
      alert(`${err.message || err}`);
    }
    return null;
  }

  componentWillUnmount() {
    this.props.setActiveFocusChannel('');
  }

  render() {
    const {theme} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: theme.primaryBackgroundColor}}>
        <TabView
          navigationState={{...this.state}}
          renderScene={SceneMap({
            chat: ChannelTab,
            charts: Chart,
            book: Book,
            history: History,
            stat: Stat,
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
          lazy
          renderLazyPlaceholder={() => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
              }}>
              <ActivityIndicator size="large" color="#17C491" />
            </View>
          )}
          removeClippedSubviews={Platform.OS === 'android'}
          //swipeEnabled={false}
        />
      </View>
    );
  }
}

const mapDispatchToProps = {
  setActiveFocusChannel,
  getChannelByName,
};

const mapStateToProps = state => ({
  selectedSymbol: state.watchlist.selectedSymbol,
  channels: state.mapChannels.valueSeq().toJS(),
  myChannels: state.myChannelsMap
    .map(id => state.mapChannels.get(id))
    .filter(channel => channel)
    .valueSeq()
    .toJS(),
  theme: state.themes[state.themes.current],
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CryptoRoom);
