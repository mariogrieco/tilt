import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  ActivityIndicator,
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

const BACK = require('../../assets/images/pin-left-black/pin-left.png');

// const ChannelTab = () => <Channel displayAs="tab" />;
const ChannelTab = () => <ChannelOptionalView />;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    shadowColor: '#D9D8D7',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    backgroundColor: '#fff',
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
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', ''),
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
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
      channel => channel.name === selectedSymbol.symbol.toLowerCase(),
    );
    const foundOnMy = myChannels.find(
      channel => channel.name === selectedSymbol.symbol.toLowerCase(),
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
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
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
              style={styles.tabBar}
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
  myChannels: state.myChannelsMap.valueSeq().toJS(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CryptoRoom);
