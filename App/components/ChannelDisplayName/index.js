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
// import Rocket from '../IconStore/Rocket';
import isChannelCreatorAdmin from '../../selectors/isChannelCreatorAdmin';

const EARTH = require('../../../assets/images/earth/earth.png');
const NEW = require('../../../assets/images/new/new.png');
const GOAT = require('../../../assets/images/goat/goat.png');
const STAR = require('../../../assets/images/star/star.png');
const CHANNEL_ROCKET = require('../../../assets/images/channelRocket/channelRocket.png');
const FIRE = require('../../../assets/images/fire/fire.png');

class ChannelDisplayName extends Component {
  state = {
    loading: false,
  };

  onPress = () => {
    const {channel_id, name, channel, isfromAdmin} = this.props;
    this.props.setActiveFocusChannel(channel_id);
    NavigationService.navigate('Channel', {
      name: name,
      create_at: channel.create_at,
      members: channel.members,
      fav: channel.fav,
      isAdminCreator: isfromAdmin,
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.loading && nextState.loading) return false;
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  onJoin = () => {
    if (this.state.loading) return null;
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
      isfromAdmin,
    } = this.props;

    const diff = moment(create_at).diff(moment(), 'days') >= -3;

    return (
      <View style={styles.headerContainer}>
        <Text style={[styles.header, titleColor ? {color: titleColor} : {}]}>
          <Text style={styles.hashtag}>{isfromAdmin ? '$' : '#'}</Text>{' '}
          {name}{' '}
        </Text>
        <View style={styles.icon}>
          {diff && <Image source={NEW} />}
          {!diff && members > 10000 && <Image source={FIRE} />}
          {!diff && members > 100000 && <Image source={CHANNEL_ROCKET} />}
          {!diff && members > 1000000 && <Image source={GOAT} />}
          {fav && <Image source={STAR} />}
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
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <View style={styles.imageContainer}>
          <Image styles={styles.imageContainer} source={EARTH} />
        </View>
        <View>
          {this.getHeader()}
          {this.getMembersLabel()}
        </View>
      </TouchableOpacity>
    );
  }

  getDescription() {
    const {channel} = this.props;

    if (!channel || !channel.purpose) return <View />;

    return (
      <View style={styles.paddingBottom}>
        <Text style={styles.span}>{channel.purpose}</Text>
      </View>
    );
  }

  getJoinView() {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.containerJoin}>
        <View style={styles.imageContainer}>
          <Image styles={styles.image} source={EARTH} />
        </View>
        <View style={{flex: 1}}>
          {this.getHeader()}
          {this.getDescription()}
          {this.getMembersLabel()}
        </View>
        <View style={{flex: 0.32, alignItems: 'flex-end', paddingRight: 15}}>
          <TouchableOpacity style={styles.join} onPress={this.onJoin}>
            <Text style={styles.joinText}>JOIN</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if (this.props.join) return this.getJoinView();
    return this.getDefaultView();
  }
}

ChannelDisplayName.defaultProps = {
  showMembersLabel: true,
};

const mapStateToProps = (state, props) => ({
  meId: state.login.user ? state.login.user.id : {},
  isfromAdmin: isChannelCreatorAdmin(state, props.channel_id),
});

const mapDispatchToProps = {
  setActiveFocusChannel,
  addToChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChannelDisplayName);
