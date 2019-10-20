import React from 'react';
import {
  TouchableOpacity,
  Image,
  Dimensions, View, Animated,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import {
  TabView,
  SceneMap,
  TabBar,
} from 'react-native-tab-view';
import StyleSheet from 'react-native-extended-stylesheet';
import {
  searchChannels
} from '../actions/search';
import Channels from '../components/Channels';
import Discover from '../components/Discover';
import SearchBar from '../components/SearchBar';
import PublicSearch from '../components/PublicSearch';
import { headerForScreenWithTabs } from '../config/navigationHeaderStyle';

const PLUS = require('../../assets/images/plus/plus.png');
const CLOSE = require('../../assets/images/close/shape.png');

const { width } = Dimensions.get('window');

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
    backgroundColor: '#fff'
  },
  label: {
    // color: '#0E141E',
    fontSize: 14,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold'
  },
  indicator: {
    backgroundColor: '#17C491',
    // backgroundColor: 'rgba(16, 115, 240, 0.75)',
    height: 3
  }
});

class PublicChat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: '',
    ...headerForScreenWithTabs,
    headerLeft: (
      <View style={styles.searchContainer}>
        <SearchBar
          inputStyle={styles.input}
          placeholderText="Search for a channel or username"
          placeholderTextColor="#8E8E95"
          growPercentage={0.85}
          onChangeText={navigation.getParam('onSearch', () => {})}
          inputValue={navigation.getParam('searchValue', '')}
        />
      </View>
    ),
    headerRight: navigation.getParam('isSearching', false)
      ? (
        <TouchableOpacity
          style={{ paddingHorizontal: 15, paddingBottom: 8 }}
          onPress={() => {
            navigation.setParams({
              isSearching: false
            });
            navigation.getParam('onSearch', () => {})('');
          }}
        >
          <Image source={CLOSE} />
        </TouchableOpacity>
      )
      : (
        <TouchableOpacity
          style={{ paddingHorizontal: 15, paddingBottom: 8 }}
          onPress={() => navigation.navigate('CreateChannel')}
        >
          <Image source={PLUS} />
        </TouchableOpacity>
      )
  });

  state = {

    index: 0,
    routes: [
      { key: 'channels', title: 'MY CHANNELS' },
      { key: 'discover', title: 'DISCOVER' },
    ],
    searchValue: '',
    currentToggleSelected: 'left'
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setParams({
      onSearch: this.handleSearch
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(this.state, nextState);
  }


  handleSearch = (text) => {
    const { navigation } = this.props;
    this.setState(() => {
      navigation.setParams({
        isSearching: text !== '',
        searchValue: text.toLowerCase()
      });
      return { searchValue: text.toLowerCase() };
    }, () => {
      this.searchFor(text);
    });
  }

  async searchFor(queryStr) {
    // if (this.state.searchValue !== queryStr) return null;
    try {
      await this.props.searchChannels('k1df69t1ibryue11z5wd4n48nr', queryStr);
    } catch (ex) {
      alert(ex.message || ex);
    }
  }

  renderChannels = () => (
    <React.Fragment>
      <TabView
        navigationState={{ ...this.state }}
        renderScene={SceneMap({
          channels: Channels,
          discover: Discover
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width }}
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
      />
    </React.Fragment>
  )

  render() {
    const { searchValue } = this.state;
    return (
      <React.Fragment>

        {
          searchValue !== ''
            ? (
              <PublicSearch
                searchValue={searchValue}
              />
            )
            : this.renderChannels()

        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  searchChannels
};

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(PublicChat)
);
