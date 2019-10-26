import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import Modal from 'react-native-modal';
import StyleSheet from 'react-native-extended-stylesheet';
import Dimensions from 'react-native-extra-dimensions-android';
import CreateChannelField, {
  Title,
  Description,
  Input,
} from '../components/CreateChannelField';
import GoBack from '../components/GoBack';
import {createChannel} from '../actions/channels';
import Separator from '../components/Separator';
import Spacer from '../components/Spacer';

const H = Dimensions.get('REAL_WINDOW_HEIGHT');
const W = Dimensions.get('REAL_WINDOW_WIDTH');

const BACK = require('../../assets/images/pin-left-black/pin-left.png');

const styles = StyleSheet.create({
  modal: {
    width: '20rem',
    alignSelf: 'center',
    alignItems: 'center',
    color: '$textColor',
    backgroundColor: 'white',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    overflow: 'hidden',
    paddingHorizontal: '1rem',
  },
  textContainer: {
    marginTop: '1rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  textModalTitle: {
    fontFamily: 'SFProDisplay-Bold',
    textAlign: 'center',
    fontSize: 17,
    letterSpacing: 0.1,
    marginBottom: '1rem',
    color: '#0e141e',
  },
  textModal: {
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  textModalDescription: {
    fontFamily: 'SFProDisplay-Regular',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
  },
  modalOptions: {
    width: '20rem',
    alignSelf: 'center',
    color: '$textColor',
    backgroundColor: 'white',
    borderBottomLeftRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    overflow: 'hidden',
    flexDirection: 'row',
    borderTopColor: '#DCDCDC',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  textDestructive: {
    paddingTop: '0.6rem',
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 16,
    letterSpacing: 0.1,
    flex: 1,
    textAlign: 'center',
    paddingBottom: '0.85rem',
  },
});

class CreateChannel extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'New Channel',
    headerLeft: <GoBack icon={BACK} onPress={() => navigation.goBack()} />,
    headerRight: (
      <TouchableOpacity
        style={{paddingHorizontal: 15, paddingVertical: 13}}
        onPress={navigation.getParam('modalCreate', () => {})}>
        <Text
          style={{
            fontFamily: 'SFProDisplay-Bold',
            fontSize: 16,
            letterSpacing: 0.1,
            color: '#17C491',
          }}>
          Create
        </Text>
      </TouchableOpacity>
    ),
    headerStyle: {
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
    headerTitleStyle: {
      fontSize: 18,
      letterSpacing: 0.1,
      marginTop: 10,
      marginBottom: 10,
      fontFamily: 'SFProDisplay-Bold',
    },
    headerTintColor: '#0E141E',
  });

  state = {
    title: null,
    purpose: null,
    header: null,
    publicChannelModal: false,
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  onCreate = async () => {};

  onChangeTitle = value => {
    this.setState({
      title: value,
    });
  };

  onChangePurpose = value => {
    this.setState({
      purpose: value,
    });
  };

  onChangeHeader = value => {
    this.setState({
      header: value,
    });
  };

  componentDidMount() {
    const active_name = this.props.navigation.getParam('active_name', null);
    this.props.navigation.setParams({
      onCreate: this.onCreate,
      modalCreate: this.modalCreate,
    });
    if (active_name) {
      this.onChangeTitle(active_name);
    }
  }

  modalCreate = () => {
    if (this.state.loading) return null;
    this.setState(
      {
        loading: true,
      },
      async () => {
        const {title, header, purpose} = this.state;
        if (title !== null && header !== null) {
          try {
            await this.props.createChannel({
              title,
              purpose,
              header,
            });
            this.setState({
              publicChannelModal: true,
            });
          } catch (ex) {
            alert(ex);
          } finally {
            this.setState({
              loading: false,
            });
          }
        } else {
          alert(
            'Please fill in the name and header information for your channel.',
          );
        }
      },
    );
  };

  toggleModal = () => {
    this.setState(
      {
        publicChannelModal: !this.state.publicChannelModal,
      },
      () => {
        if (!this.state.publicChannelModal) {
          const {navigation} = this.props;
          navigation.navigate('PublicChat');
        }
      },
    );
  };

  renderModalPublic = () => (
    <Modal
      isVisible={this.state.publicChannelModal}
      deviceHeight={H}
      deviceWidth={W}>
      <View style={styles.modal}>
        <View style={styles.textContainer}>
          <Text style={styles.textModalTitle}>Channel Created 🙌</Text>
          <Text style={styles.textModalDescription}>
            Your channel is now live. Visit your Channel Info to invite new
            members.
          </Text>
        </View>
      </View>
      <View style={styles.modalOptions}>
        <Text
          style={[styles.textDestructive, {color: '#17C491'}]}
          onPress={this.toggleModal}>
          Done
        </Text>
      </View>
    </Modal>
  );

  render() {
    const {title, purpose, header, publicChannelModal} = this.state;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0;
    return (
      <ScrollView
        keyboardDismissMode="on-drag"
        style={{flex: 1, backgroundColor: '#f6f7f9'}}>
        {publicChannelModal && this.renderModalPublic()}
        <CreateChannelField>
          <Title title="Name (required)" />
          <Separator />
          <Input
            value={title}
            placeHolder="Example: ”swing-traders”"
            onChangeText={this.onChangeTitle}
          />
          <Separator />
        </CreateChannelField>
        <Spacer />
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={Platform.OS === 'ios' ? 'position' : undefined}>
          <CreateChannelField>
            <Title title="Purpose (optional)" />
            <Separator />
            <Input
              placeHolder="Example: “Learn how to swing trade successfully”"
              onChangeText={this.onChangePurpose}
              value={purpose}
              multiline
            />
            <Separator />
            <Description description="Describe how this channel should be used. This text will appear beside the channel name." />
            <Spacer />
          </CreateChannelField>
          <CreateChannelField>
            <Title title="Header (required)" />
            <Separator />
            <Input
              placeHolder="Example: “Visit http://example.com to learn more.”"
              onChangeText={this.onChangeHeader}
              value={header}
              multiline
            />
            <Separator />
            <Description description="Set text that will appear in the header of the channel. For example, include frequently used links, FAQs, or any additional information that is valuable to investors and traders." />
          </CreateChannelField>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  me: state.login.user,
});

const mapDispatchToProps = {
  createChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateChannel);
