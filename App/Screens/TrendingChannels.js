import React, {Component} from 'react';
import {Text, TouchableOpacity, Platform, FlatList} from 'react-native';
// import PropTypes from 'prop-types'
import {connect} from 'react-redux';
// import {NavigationActions} from 'react-navigation';
import moment from 'moment';
import GoBack from '../components/GoBack';
import {headerForScreenWithBottomLine} from '../config/navigationHeaderStyle';
import isEqual from 'lodash/isEqual';
import ChannelDisplayName from '../components/ChannelDisplayName';
import getChannelsList from '../selectors/getChannelsList';

// import styles from './styles';

export class TrendingChannels extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: 'Trending Channels',
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

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  keyExtractor(channel) {
    return channel.id;
  }

  renderItem = ({item}) => {
    const {channelStatsGroup} = this.props;
    return (
      <ChannelDisplayName
        channel={item}
        fav={item.fav}
        members={channelStatsGroup[item.id] || 0}
        name={item.name}
        create_at={item.create_at}
        key={item.id}
        channel_id={item.id}
        titleColor={item.titleColor}
        unreadMessagesCount={item.unreadMessagesCount}
      />
    );
  };

  render() {
    const {channels, theme} = this.props;
    return (
      <FlatList
        extraData={channels}
        data={channels}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        initialNumToRender={8}
        ListEmptyComponent={this.renderActivityIndicator}
        keyboardDismissMode="on-drag"
        removeClippedSubviews={Platform.OS === 'android'}
        style={{backgroundColor: theme.primaryBackgroundColor}}
      />
    );
  }
}

const mapStateToProps = state => ({
  channels: getChannelsList(state),
  theme: state.themes[state.themes.current],
  isAuth: state.login.isLogin,
  channelStatsGroup: state.channelStatsGroup,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingChannels);
