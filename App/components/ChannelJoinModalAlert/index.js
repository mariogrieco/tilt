import React, { Component } from 'react';
import { Alert } from 'react-native';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Modal from 'react-native-modal';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import {
  closeModal
} from '../../actions/channelJoinModalAlert';
import {
  setActiveFocusChannel
} from '../../actions/AppNavigation';
import {
  addToChannel
} from '../../actions/channels';
import parser from '../../utils/parse_display_name';
import NavigationService from '../../config/NavigationService';
import { getFavoriteChannelById } from '../../selectors/getFavoriteChannels';

// import styles from './style';

export class ChannelJoinModalAlert extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // }
  static getDerivedStateFromProps(props, { isVisible, loading }) {
    if (props.open !== isVisible) {
      return {
        isVisible: props.open,
        loading
      };
    }
    return { isVisible, loading };
  }

  state = {
    isVisible: false,
    loading: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  componentDidMount() {
    this.open();
  }

  componentDidUpdate() {
    this.open();
  }

  onJoin = async () => {
    const { channel } = this.props;
    try {
      this.props.closeModal();
      await this.join(channel);
      await this.redirect(channel);
    } catch (err) {
      alert(err.message || err);
    }
  }

  redirect(channel) {
    this.props.setActiveFocusChannel(channel.id);
    NavigationService.navigate('Channel', {
      display_name: channel.display_name,
      create_at: channel.create_at,
      members: channel.members,
      fav: channel.fav
    });
  }

  join(channel) {
    if (this.state.loading) return null;
    this.setState({
      loading: true
    }, async () => {
      const {
        meId
      } = this.props;
      try {
        await this.props.addToChannel(meId, channel.id);
      } catch (err) {
        alert(err);
      } finally {
        this.setState({
          loading: false
        });
      }
    });
  }

  onCancel = () => {
    this.props.closeModal();
  };

  open = () => {
    if (!this.state.isVisible) return null;
    const {
      channel
    } = this.props;
    Alert.alert(
      'Join Channel',
      `You are not a member of #${channel.display_name}. Would you like to join the channel?`,
      [
        {
          text: 'Cancel',
          onPress: this.onCancel.bind(this),
          style: 'cancel',
        },
        {
          text: 'Join',
          onPress: this.onJoin.bind(this),
          style: 'default'
        },
      ],
      { cancelable: false },
    );
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  const channel = cloneDeep(state.channels.find(_channel => state.channelJoinModalAlert.channelId === _channel.id));
  if (channel) {
    channel.fav = getFavoriteChannelById(state, channel.id);
    channel.display_name = parser(channel.display_name)
  }
  return {
    open: !!channel,
    channel,
    meId: state.login.user ? state.login.user.id : {},
  };
};

const mapDispatchToProps = {
  closeModal,
  addToChannel,
  setActiveFocusChannel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelJoinModalAlert);