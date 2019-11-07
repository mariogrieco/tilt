import React, {Fragment} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  // ScrollView
} from 'react-native';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';
import Separator from '../components/Separator';
import NavigationService from '../config/NavigationService';
import {sendEmailGuestInvitesToChannels} from '../actions/invitations';
import TopBlockSpace from '../components/TopBlockSpace';
import GoBack from '../components/GoBack';

const BACK = require('../../assets/themes/light/pin-left/pin-left.png');
const EMAIL = require('../../assets/themes/light/envelope/envelope.png');
// const GROUP = require('../../assets/themes/light/group/group.png');
const ADD_MEMBER = require('../../assets/themes/light/add-user/user.png');
const ANTENNA = require('../../assets/themes/light/radio-antenna/radio-antenna.png');

const validEmailRx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@" ]+)*)|(".+" ))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Email = ({onTextChange, onFocus, onBlur, placeHolder, value}) => (
  <View
    style={{
      flexDirection: 'row',
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: 'white',
    }}>
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 8,
      }}>
      <Image source={EMAIL} />
    </View>
    <TextInput
      style={{
        flex: 1,
        fontSize: 16,
        paddingBottom: 10,
        paddingTop: 11,
        fontFamily: 'SFProDisplay-Regular',
        letterSpacing: 0.1,
      }}
      placeholder={placeHolder}
      selectionColor="green"
      onChangeText={onTextChange}
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      autoCapitalize="none"
    />
  </View>
);

class AddMember extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Add Members',
    headerLeft: <GoBack onPress={() => navigation.goBack()} icon={BACK} />,
    headerRight: (
      <TouchableOpacity onPress={navigation.getParam('handleSend', () => {})}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'SFProDisplay-Bold',
            color: '#17C491',
            paddingHorizontal: 15,
            paddingVertical: 13,
          }}>
          Send
        </Text>
      </TouchableOpacity>
    ),
  });

  state = {
    [`email${0}`]: false,
    emailsIndexes: [0],
    loading: false,
  };

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setParams({
      handleSend: this.handleSend,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  onFocusAddLabel = () => {
    this.setState(preVState => {
      const nextIndexes = [...preVState.emailsIndexes];
      nextIndexes.push(preVState.emailsIndexes.length);
      return {
        emailsIndexes: nextIndexes,
      };
    });
  };

  onBlurAddLabel = () => {
    const nextState = {};
    const mappedIndexes = this.state.emailsIndexes.filter((i, index) => {
      if (index !== this.state.emailsIndexes.length - 1) {
        const match = !!this.state[`email${index}`];
        if (!match) {
          nextState[`email${index}`] = undefined;
        }
        return match;
      }
      return true;
    });
    this.setState({
      emailsIndexes: mappedIndexes,
      ...nextState,
    });
  };

  handleEmail = index => text => {
    this.setState({
      [`email${index}`]: text,
    });
  };

  handleSend = () => {
    const mappedIndexes = this.state.emailsIndexes; // .filter((v, i) => i === 0 || (this.state[`email${i}`] && this.state[`email${i}`].trim() !== ''));
    this.setState(
      {
        emailsIndexes: mappedIndexes,
      },
      () => {
        this._handleEmailInvitations(
          mappedIndexes
            .map((v, index) => this.state[`email${index}`])
            .filter(str => str && str.match(validEmailRx)),
        );
      },
    );
  };

  clearState() {
    const nextState = {};
    this.state.emailsIndexes.forEach((i, index) => {
      nextState[`email${index}`] = undefined;
    });
    this.setState({
      emailsIndexes: [0],
      ...nextState,
      email0: '',
    });
  }

  _handleEmailInvitations(emails = []) {
    if (emails.length === 0) return null;
    if (this.state.loading) return null;
    this.setState(
      {
        loading: true,
      },
      async () => {
        const {sendEmailGuestInvitesToChannels, channelId} = this.props;
        try {
          await sendEmailGuestInvitesToChannels(
            [channelId],
            emails,
            'message here',
          );
          this.clearState();
          Alert.alert('', 'Thanks for sharing 🎉!');
        } catch (err) {
          alert(err);
        } finally {
          this.setState({
            loading: false,
          });
        }
      },
    );
  }

  gotoInvite = () => {
    NavigationService.navigate('InviteContacts');
  };

  render() {
    const {emailsIndexes} = this.state;
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        style={{flex: 1, backgroundColor: '#f6f7f9'}}>
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Image source={ANTENNA} />
        </View>
        <Separator />
        {emailsIndexes.map((d, index) => (
          <Fragment>
            <Email
              onTextChange={this.handleEmail(index)}
              placeHolder="Type an email address to invite"
              onFocus={this.onFocusAddLabel}
              value={this.state[`email${index}`]}
              onBlur={this.onBlurAddLabel}
            />
            <Separator />
          </Fragment>
        ))}
        <TopBlockSpace />
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginRight: 8,
            }}>
            <Image source={ADD_MEMBER} />
          </View>
          <TouchableOpacity
            style={{flex: 1, paddingTop: 11, paddingBottom: 11}}
            onPress={this.gotoInvite}>
            <Text
              style={{
                fontFamily: 'SFProDisplay-Regular',
                fontSize: 16,
                letterSpacing: 0.1,
                color: '#0e141e',
              }}>
              Contacts
            </Text>
          </TouchableOpacity>
        </View>
        <Separator />
        <Text
          style={{
            paddingTop: 20,
            alignSelf: 'center',
            fontSize: 16,
            letterSpacing: 0.1,
            fontFamily: 'SFProDisplay-Regular',
            color: '#8E8E95',
          }}>
          Tilt is better with others. 👽
        </Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  channelId: state.appNavigation.active_channel_id,
});

const mapDispatchToProps = {
  sendEmailGuestInvitesToChannels,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddMember);
