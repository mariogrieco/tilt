import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import moment from 'moment';
import NavigationService from '../../config/NavigationService';
import {setActiveFocusChannel} from '../../actions/AppNavigation';
import {addToChannel} from '../../actions/channels';
import parser from '../../utils/parse_display_name';
import styles from './styles';

const EARTH = require('../../../assets/themes/light/earth/earth.png');
const NEW = require('../../../assets/themes/light/new/new.png');
const GOAT = require('../../../assets/themes/light/goat/goat.png');
const STAR = require('../../../assets/themes/light/star/star.png');
const CHANNEL_ROCKET = require('../../../assets/themes/light/channelRocket/channelRocket.png');
const FIRE = require('../../../assets/themes/light/fire/fire.png');

class ChannelDisplayName extends Component {
  state = {
    loading: false,
  };

  onPress = () => {
    const {channel_id, name, channel} = this.props;
    this.props.setActiveFocusChannel(channel_id);
    NavigationService.navigate('Channel', {
      title: parser(name),
      create_at: channel.create_at,
      members: channel.members,
      fav: channel.fav,
      isAdminCreator: channel.content_type !== 'N',
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.loading && nextState.loading) {
      return false;
    }
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  onJoin = () => {
    if (this.state.loading) {
      return null;
    }
    this.setState(
      {
        loading: true,
      },
      async () => {
        const {meId, channel_id} = this.props;
        try {
          await this.props.addToChannel(meId, channel_id);
        } catch (err) {
          alert(err);
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  };

  parseDisplayName(str = '') {
    return parser(str);
  }

  getHeader() {
    const {
      name,
      create_at,
      members,
      fav,
      titleColor,
      isDollar,
      unreadMessagesCount,
      theme,
    } = this.props;

    const diff = moment(create_at).diff(moment(), 'days') >= -3;

    return (
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.header,
            {color: theme.primaryTextColor},
            titleColor ? {color: titleColor} : {},
            isDollar ? {textTransform: 'uppercase'} : {},
          ]}>
          <Text style={styles.hashtag}>{isDollar ? '$' : '#'}</Text> {name}{' '}
        </Text>
        <View style={styles.icons}>
          {diff && (
            <View style={styles.icon}>
              <Image source={NEW} />
            </View>
          )}
          {!diff && members > 10000 && (
            <View style={styles.icon}>
              <Image source={FIRE} />
            </View>
          )}
          {!diff && members > 100000 && (
            <View style={styles.icon}>
              <Image source={CHANNEL_ROCKET} />
            </View>
          )}
          {!diff && members > 1000000 && (
            <View style={styles.icon}>
              <Image source={GOAT} />
            </View>
          )}
          {fav && (
            <View style={styles.icon}>
              <Image source={STAR} />
            </View>
          )}
          {unreadMessagesCount > 0 && (
            <View style={[styles.unreadMessages]}>
              <Text
                style={[
                  styles.unreadText,
                  {color: theme.primaryBackgroundColor},
                ]}>
                {unreadMessagesCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  getMembersLabel() {
    const {members, showMembersLabel} = this.props;
    const memberLabel = members > 1 || members < 1 ? 'members' : 'member';
    return (
      <View>
        {showMembersLabel && (
          <Text style={styles.span}>{`${members} ${memberLabel}`}</Text>
        )}
      </View>
    );
  }

  getDefaultView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.container,
          {backgroundColor: theme.primaryBackgroundColor},
        ]}
        activeOpacity={1}
        onPress={this.onPress}>
        {/*<View style={styles.imageContainer}>*/}
        {/*  <Image styles={styles.imageContainer} source={EARTH} />*/}
        {/*</View>*/}
        <View>
          {this.getHeader()}
          {this.getMembersLabel()}
        </View>
      </TouchableOpacity>
    );
  }

  getDescription() {
    const {channel} = this.props;

    if (!channel || !channel.purpose) {
      return <View />;
    }

    return (
      <View style={styles.paddingBottom}>
        <Text style={styles.span}>{channel.purpose}</Text>
      </View>
    );
  }

  getJoinView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity activeOpacity={1} style={styles.containerJoin}>
        {/*<View style={styles.imageContainer}>*/}
        {/*  <Image styles={styles.image} source={EARTH} />*/}
        {/*</View>*/}
        <View style={{flex: 1}}>
          {this.getHeader()}
          {this.getDescription()}
          {this.getMembersLabel()}
        </View>
        <View style={{flex: 0.32, alignItems: 'flex-end', paddingRight: 15}}>
          <TouchableOpacity
            style={[
              styles.join,
              {backgroundColor: theme.joinButtonBackgroundColor},
            ]}
            onPress={this.onJoin}>
            <Text style={styles.joinText}>JOIN</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.props.join) {
      return this.getJoinView();
    }
    return this.getDefaultView();
  }
}

ChannelDisplayName.defaultProps = {
  showMembersLabel: true,
};

const mapStateToProps = (state, props) => ({
  meId: state.login.user ? state.login.user.id : {},
  isDollar: props.content_type !== 'N',
  theme: state.themes[state.themes.current],
});

const mapDispatchToProps = {
  setActiveFocusChannel,
  addToChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelDisplayName);
