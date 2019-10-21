import React, {Component, createRef} from 'react';
import {FlatList, View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';
import Separator from '../components/Separator';
import FilterPopulateItem from '../components/FilterPopulateItem';
import SearchResults from '../components/SearchResults';
// import RecentSearches from '../components/RecentSearches';
import SearchBar from '../components/SearchBar';
import {searchPostsWithParams} from '../actions/advancedSearch';
import getAdvancedSearchList from '../selectors/getAdvancedSearchList';
import Suggestions from '../components/Suggestions';
import isChannelCreatorAdmin from '../selectors/isChannelCreatorAdmin';
// import PropTypes from 'prop-types'

const fromRegx = /(from:.[a-z0-9_-]+)|(from:)/gi;
const inRegx = /(in:.[a-z0-9_-]+)|(in:)/gi;

export class AdvancedSearch extends Component {
  refInput = createRef();
  state = {
    queryStr: '',
    activeMentionBox: null,
    activeChannelBox: null,
    selection: {
      start: 0,
      end: 0,
    },
  };

  openMentionBox = () => {
    this.setState({
      // activeChannelBox: false,
      activeMentionBox: true,
    });
  };

  closeMentionBox = () => {
    this.setState({
      // activeChannelBox: false,
      activeMentionBox: false,
    });
  };

  openChannelBox = () => {
    this.setState({
      activeChannelBox: true,
      // activeMentionBox: false
    });
  };

  closeChannelBox = () => {
    this.setState({
      activeChannelBox: false,
      // activeMentionBox: false
    });
  };

  static navigationOptions = ({navigation}) => ({
    headerLeft: (
      <SearchBar
        handleRef={navigation.getParam('refInput', null)}
        inputStyle={{
          fontSize: 16,
          letterSpacing: 0.1,
          fontFamily: 'SFProDisplay-Regular',
          padding: 1,
        }}
        placeholderText="Search for a word"
        placeholderTextColor="#8E8E95"
        growPercentage={0.77}
        onChangeText={navigation.getParam('onSearch', () => {})}
        inputValue={navigation.getParam('queryStr', '')}
        onSelectionChange={navigation.getParam('onSelectionChange', () => {})}
      />
    ),
    headerRight: (
      <TouchableOpacity
        style={{
          paddingHorizontal: 15,
          paddingBottom: 8,
        }}
        onPress={() => navigation.goBack()}>
        <Text
          style={{
            color: '#0e141e',
            fontSize: 16,
            letterSpacing: 0.1,
            fontFamily: 'SFProDisplay-Medium',
          }}>
          Cancel
        </Text>
      </TouchableOpacity>
    ),
  });

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  interpolateStr = text => {
    const {queryStr} = this.state;
    this.handleSearch(`${queryStr} ${text}`);
  };

  interpolateChannel = () => {
    this.openChannelBox();
    this.interpolateStr('in: ');
    this.forceFocusOnInput();
  };

  interpolateUser = () => {
    this.openMentionBox();
    this.interpolateStr('from: ');
    this.forceFocusOnInput();
  };

  forceFocusOnInput() {
    const {refInput} = this;
    if (refInput && refInput.current) {
      refInput.current.focus();
    }
  }

  onSelectionChange = e => {
    this.setState(
      {
        selection: e.nativeEvent.selection,
      },
      this.openForCases,
    );
  };

  openForCases() {
    const forCase = this.getForCaseIndex();
    const inCase = this.getInCaseIndex();

    if (forCase) {
      this.openMentionBox();
    } else {
      // this.closeMentionBox();
    }

    if (inCase) {
      this.openChannelBox();
    } else {
      // this.closeMentionBox();
    }
  }

  getForCaseIndex() {
    const {selection, queryStr} = this.state;
    let start = 0;
    let end = 0;
    const patt = fromRegx;
    const matches = queryStr.match(fromRegx);
    const startCursor = selection.start;
    let currentIndex = null;
    while ((match = patt.exec(queryStr))) {
      if (startCursor - 1 <= patt.lastIndex && match.index <= startCursor) {
        currentIndex = matches.indexOf(match[0]);
        end = patt.lastIndex;
        start = match.index;
        break;
      }
    }
    return currentIndex !== null
      ? {
          end,
          start,
          currentIndex,
        }
      : null;
  }

  getInCaseIndex() {
    const {selection, queryStr} = this.state;
    let start = 0;
    let end = 0;
    const patt = inRegx;
    const matches = queryStr.match(inRegx);
    const startCursor = selection.start;
    let currentIndex = null;
    while ((match = patt.exec(queryStr))) {
      if (startCursor - 1 <= patt.lastIndex && match.index <= startCursor) {
        currentIndex = matches.indexOf(match[0]);
        end = patt.lastIndex;
        start = match.index;
        break;
      }
    }
    return currentIndex !== null
      ? {
          end,
          start,
          currentIndex,
        }
      : null;
  }

  renderItem = ({item}) => (
    <FilterPopulateItem
      type={item}
      onPress={
        item === 'channel' ? this.interpolateChannel : this.interpolateUser
      }
    />
  );

  renderSeparator() {
    return <Separator />;
  }

  handleSearch = value => {
    const {navigation} = this.props;
    this.setState(() => {
      navigation.setParams({
        queryStr: value,
      });
      return {
        queryStr: value,
      };
    }, this._fetch);
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({
      onSearch: this.handleSearch,
      onSelectionChange: this.onSelectionChange,
      refInput: this.refInput,
    });
  }

  _fetch = () => {
    if (this.state.queryStr && this.state.queryStr.trim() === '') return null;
    this.setState(
      {
        loading: true,
      },
      async () => {
        const {searchPostsWithParams} = this.props;
        const {queryStr} = this.state;
        try {
          const r = await searchPostsWithParams(queryStr, 0);
          console.log('result: ', r);
        } catch (err) {
          // alert(err);
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  keyExtractor = item => item;

  filterMentions(data) {
    const {queryStr} = this.state;
    const filterCase = this.getForCaseIndex();
    if (filterCase) {
      let value = queryStr.match(fromRegx)[filterCase.currentIndex];
      value = value.replace('from: ', '').trim();
      if (value && !value.match('from:')) {
        return data.filter(({username}) => username.includes(`${value}`));
      } else {
        return data;
      }
    } else {
      this.closeMentionBox();
    }
    return data;
  }

  filterChannels(data) {
    const {queryStr} = this.state;
    const filterCase = this.getInCaseIndex();
    if (filterCase) {
      let value = queryStr.match(inRegx)[filterCase.currentIndex];
      value = value.replace('in: ', '').trim();
      if (value && !value.match('in:')) {
        return data.filter(({name}) => name.match(`${value}`));
      } else {
        return data;
      }
    } else {
      this.closeChannelBox();
    }
    return data;
  }

  renderChannelBox() {
    const {channels} = this.props;
    return (
      <Suggestions
        onChannel={this.onChannel}
        data={this.filterChannels(channels)}
        headerLabel="Channels"
        channel
      />
    );
  }

  renderMentionBox() {
    const {users} = this.props;
    return (
      <Suggestions
        onMention={this.onMention}
        data={this.filterMentions(users)}
        headerLabel="Users"
        user
      />
    );
  }

  onMention = name => {
    const {queryStr} = this.state;
    const filterCase = this.getForCaseIndex();
    if (filterCase) {
      const nextStr =
        queryStr.slice(0, filterCase.start) +
        `from: ${name} ` +
        queryStr.slice(filterCase.end, queryStr.length);
      this.handleSearch(nextStr);
      this.closeMentionBox();
    }
  };

  onChannel = name => {
    const {queryStr} = this.state;
    const filterCase = this.getInCaseIndex();
    if (filterCase) {
      const nextStr =
        queryStr.slice(0, filterCase.start) +
        `in: ${name} ` +
        queryStr.slice(filterCase.end, queryStr.length);
      this.handleSearch(nextStr);
      this.closeChannelBox();
    }
  };

  render() {
    const {
      posts,
      usernames,
      channelsNames,
      // users
    } = this.props;
    const {loading, activeMentionBox, activeChannelBox} = this.state;
    return (
      <View style={{flex: 1}}>
        {activeMentionBox && this.renderMentionBox()}
        {activeChannelBox && this.renderChannelBox()}
        <View style={{marginBottom: 0}}>
          <FlatList
            data={['channel', 'user']}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </View>
        <SearchResults
          posts={posts}
          // usernames={usernames}
          loading={loading}
          // channelsNames={channelsNames}
        />
        {/* <RecentSearches /> */}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  ...getAdvancedSearchList(state),
  users: state.users.keys.map(key =>
    state.users.data[key] ? state.users.data[key] : {},
  ),
  channels: state.myChannelsMap
    .filter(({type}) => type === 'O')
    .map(channel => {
      return {
        ...channel,
        isDolar: isChannelCreatorAdmin(state, channel.id),
      };
    })
    .valueSeq()
    .toJS(),
});

const mapDispatchToProps = {
  searchPostsWithParams,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AdvancedSearch),
);
