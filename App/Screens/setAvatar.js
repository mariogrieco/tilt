import React from 'react';
import {View, Text, TextInput} from 'react-native';
import {NavigationActions} from 'react-navigation';
import StyleSheet from 'react-native-extended-stylesheet';
import Form from '../components/Form';
import GoBack from '../components/GoBack';

const BACK = require('../../assets/images/pin-left/pin-left.png');

const styles = StyleSheet.create({
  placeholders: {
    fontSize: 30,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Regular',
    color: '$textColor',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
    marginBottom: '7rem',
  },
  textBold: {
    fontSize: 16,
    letterSpacing: 0.1,
    color: '#0e141e',
    textAlign: 'center',
    fontFamily: 'SFProDisplay-Medium',
    paddingBottom: '1rem',
  },
});

class setAvatar extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'Avatar'),
    headerLeft: (
      <GoBack
        icon={BACK}
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  state = {
    emoji: '😉',
  };

  navigationToCreateAccount = () => {
    const {navigation} = this.props;
    navigation.navigate('CreateAccount');
  };

  updateEmoji = value => {
    const emojis = value.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
    const arr = [];
    for (let i = 0; i < emojis.length; i++) {
      const char = emojis[i];
      if (char !== '') {
        arr.push(char);
      }
    }
    this.setState({
      emoji: arr.slice(-1).toString(),
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Form
          canSend={true}
          textButton="Continue"
          navigationTo={this.navigationToCreateAccount}>
          <View style={styles.textContainer}>
            <Text style={styles.textBold}>Select an avatar.</Text>
          </View>
          <TextInput
            placeholder="😉"
            autoFocus={false}
            value={this.state.emoji}
            onChangeText={value => this.updateEmoji(value)}
            style={styles.placeholders}
          />
        </Form>
      </View>
    );
  }
}

export default setAvatar;
