import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {withNavigation} from 'react-navigation';
import {getReactionsForUser} from '../../actions/reactions';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';

import styles from './styles';

import Dislike from '../IconStore/Dislike';
import Eyes from '../IconStore/Eyes';
import Laughs from '../IconStore/Laughs';
import Like from '../IconStore/Like';
import Rocket from '../IconStore/Rocket';
import SadFace from '../IconStore/SadFace';

export class ReactionSummary extends Component {
  state = {
    '+1': '',
    '-1': '',
    joy: '',
    frowning_face: '',
    rocket: '',
    eyes: '',
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  setReactionsState(reactions) {
    reactions.forEach(reaction => {
      this.setState({
        [reaction.EmojiName]: reaction.sum,
      });
    });
  }

  componentDidMount() {
    const {navigation} = this.props;
    this.setReactionsState(this.props.reactions);

    this.navigationListener = navigation.addListener('didFocus', () => {
      this.getReactionsForUser();
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setReactionsState(nextProps.reactions);
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  getReactionsForUser = async () => {
    try {
      const {userId} = this.props;
      const reactions = await this.props.getReactionsForUser(userId);
      this.setReactionsState(reactions);
    } catch (ex) {
      console.log(ex);
    }
  };

  getCurrentReaction(emoji_name) {
    switch (emoji_name) {
      case 'eyes':
        return <Eyes />;
      case 'frowning_face':
        return <SadFace />;
      case 'rocket':
        return <Rocket />;
      case 'joy':
        return <Laughs />;
      case '-1':
        return <Dislike />;
      case '+1':
        return <Like />;
      default:
        <View />;
    }
  }

  renderSum(value) {
    const {firstLoad} = this.props;
    if (!firstLoad) {
      return value;
    }
    return value === '' ? 0 : value;
  }

  render() {
    return (
      <View style={styles.container}>
        {Object.keys(this.state).map(key => {
          return (
            <View style={styles.reactionContainer} key={key}>
              {this.getCurrentReaction(key)}
              <Text style={styles.sum}>{this.renderSum(this.state[key])}</Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = (state, props) => ({
  reactions: state.reactions[props.userId] ? state.reactions[props.userId] : [],
  firstLoad: state.reactions[props.userId],
  total: state.reactions[props.userId]
    ? state.reactions[props.userId].reduce((t, b) => {
        // eslint-disable-next-line radix
        return (t.sum ? parseInt(t.sum) : t) + parseInt(b.sum);
      }, 0)
    : 0,
});

const mapDispatchToProps = {
  getReactionsForUser,
};

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ReactionSummary),
);
