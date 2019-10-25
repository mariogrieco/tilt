import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {withNavigation} from 'react-navigation';
import {getReactionsForUser} from '../../actions/reactions';
import {connect} from 'react-redux';

import styles from './styles';

import Dislike from '../IconStore/Dislike';
import Eyes from '../IconStore/Eyes';
import Laughs from '../IconStore/Laughs';
import Like from '../IconStore/Like';
import Rocket from '../IconStore/Rocket';
import SadFace from '../IconStore/SadFace';

export class ReactionSummary extends Component {
  state = {
    '+1': 0,
    '-1': 0,
    frowning_face: 0,
    joy: 0,
    rocket: 0,
    eyes: 0,
  };

  setReactionsState(reactions) {
    reactions.forEach(reaction => {
      this.setState({
        [reaction.EmojiName]: reaction.sum,
      });
    });
  }

  componentWillUnmount() {
    if (this.navigationListener) {
      this.navigationListener.remove();
    }
  }

  componentDidMount() {
    const {navigation} = this.props;

    this.navigationListener = navigation.addListener('didFocus', () => {
      this.getReactionsForUser();
    });
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
        return <Laughs />;
      case 'rocket':
        return <Rocket />;
      case 'joy':
        return <SadFace />;
      case '-1':
        return <Dislike />;
      case '+1':
        return <Like />;
      default:
        <View />;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {Object.keys(this.state).map(key => {
          return (
            <View style={styles.reactionContainer} key={key}>
              {this.getCurrentReaction(key)}
              <Text style={styles.sum}>{this.state[key]} </Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // reactions: state.login ? state.login.reactions : [],
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
