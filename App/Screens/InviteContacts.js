import React from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Image,
  Share,
  Alert,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import StyleSheet from 'react-native-extended-stylesheet';
import Contacts from 'react-native-contacts';
import GoBack from '../components/GoBack';
import SearchBar from '../components/SearchBar';
import Separator from '../components/Separator';

const MESSAGE = require('../../assets/themes/light/invite-text/invite-text.png');
const EMAIL = require('../../assets/themes/light/invite-email/invite-email.png');
const SHARE = require('../../assets/themes/light/invite-upload/invite-upload.png');
const BACK = require('../../assets/themes/light/pin-left/pin-left.png');

const textMessage =
  'Start chatting with me on Tilt. Join now at https://4yfnj.app.link/f1zU8qPIyZ';
const emailSubject = 'You are invited to Tilt';

const styles = StyleSheet.create({
  row: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowContact: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  rowLetterGroup: {
    height: 35,
    backgroundColor: '#f6f7f9',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DCDCDC',
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconsContainer: {
    paddingTop: 25,
    paddingBottom: 25,
    width: '53%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  letterGroup: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: 18,
    letterSpacing: 0.1,
    color: '#0E141E',
  },
  name: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: 17,
    letterSpacing: 0.1,
    color: '#0E141E',
    marginBottom: 2,
  },
  phone: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#8E8E95',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  button: {
    backgroundColor: '$green',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
    borderRadius: 17,
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Medium',
    color: '#fff',
  },
});

const getSMSDivider = () => (Platform.OS === 'ios' ? '&' : '?');

const openSmsUrl = (phone = '') => () =>
  Linking.openURL(`sms:${phone}${getSMSDivider()}body=${textMessage}`);

const openEmail = () =>
  Linking.openURL(`mailto:?subject=${emailSubject}&body=${textMessage}`);

const shareContent = async () => {
  try {
    const result = await Share.share({
      message: textMessage,
    });
    Alert.alert('', 'Thanks for sharing 🎉!');
  } catch (err) {
    alert(err);
  }
};

const sortContacts = contacts =>
  contacts.sort((a, b) => a.givenName.localeCompare(b.givenName));

const getContactsAndroid = () =>
  new Promise((resolve, reject) => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message:
        'Tilt wants access to display your contacts. This app cannot send messages without your explicit permission.',
    })
      .then(() => {
        Contacts.getAll((err, contacts) => {
          if (err) {
            reject(err);
            return;
          }
          const sortedContacts = sortContacts(contacts);
          resolve(sortedContacts);
        });
      })
      .catch(err => reject(err));
  });

const formatContactName = contact => {
  if (Platform.OS === 'android' && Platform.Version <= 26) {
    return `${contact.givenName}`;
  }
  return `${contact.givenName}${
    contact.familyName ? ` ${contact.familyName}` : ''
  }`;
};

const getContactsIos = () =>
  new Promise((resolve, reject) => {
    Contacts.checkPermission((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      if (result === 'undefined') {
        Contacts.requestPermission((error, response) => {
          if (error) {
            reject(err);
            return;
          }
          if (response === 'authorized') {
            Contacts.getAll((e, contacts) => {
              if (e) {
                reject(e);
                return;
              }
              const sortedContacts = sortContacts(contacts);
              resolve(sortedContacts);
            });
          }
        });
      } else if (result === 'authorized') {
        Contacts.getAll((e, contacts) => {
          if (e) {
            reject(e);
            return;
          }
          const sortedContacts = sortContacts(contacts);
          resolve(sortedContacts);
        });
      }
    });
  });

class InviteContacts extends React.PureComponent {
  static navigationOptions = ({navigation}) => ({
    headerStyle: {
      borderBottomWidth: 0,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    headerLeft: (
      <GoBack
        
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  state = {
    contacts: [],
    search: '',
  };

  constructor(props) {
    super(props);
    this.currentLetterGroup = '';
  }

  async componentDidMount() {
    try {
      if (Platform.OS === 'android') {
        const contacts = await getContactsAndroid();
        this.setState({contacts});
      } else {
        const contacts = await getContactsIos();
        this.setState({contacts});
      }
    } catch (err) {
      alert(err);
    }
  }

  renderItem = ({item: contact, index}) => {
    let number = '';
    const name = formatContactName(contact);
    let shouldDisplayLetterGroup = false;

    if (index === 0) {
      this.currentLetterGroup = name.charAt(0);
      shouldDisplayLetterGroup = true;
    } else if (this.currentLetterGroup !== name.charAt(0)) {
      this.currentLetterGroup = name.charAt(0);
      shouldDisplayLetterGroup = true;
    }

    // eslint-disable-next-line prefer-destructuring
    if (contact.phoneNumbers[0]) {
      number = contact.phoneNumbers[0].number;
    }

    return (
      <React.Fragment>
        {shouldDisplayLetterGroup && (
          <View style={[styles.row, styles.rowLetterGroup]}>
            <Text style={styles.letterGroup}>{this.currentLetterGroup}</Text>
          </View>
        )}
        <View style={[styles.row, styles.rowContact]}>
          <View>
            <Text style={[styles.name]}>{name}</Text>
            <Text style={[styles.phone]}>{number}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={openSmsUrl(number)}>
            <Text style={styles.buttonText}>Invite</Text>
          </TouchableOpacity>
        </View>
        <Separator />
      </React.Fragment>
    );
  };

  ListEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" color="#17C491" />
    </View>
  );

  ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={openSmsUrl()}>
          <Image source={MESSAGE} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openEmail}>
          <Image source={EMAIL} />
        </TouchableOpacity>
        <TouchableOpacity onPress={shareContent}>
          <Image source={SHARE} />
        </TouchableOpacity>
      </View>
    </View>
  );

  handleSearch = text => this.setState({search: text.toLowerCase()});

  render() {
    const {contacts, search} = this.state;
    const data = contacts.filter(({givenName, phoneNumbers, familyName}) => {
      const hasGivenName = givenName
        ? givenName.toLowerCase().includes(search)
        : false;
      const hasPhoneNumber = phoneNumbers[0]
        ? phoneNumbers[0].number.toLowerCase().includes(search)
        : false;
      const hasFamilyName = familyName
        ? familyName.toLowerCase().includes(search)
        : false;
      return hasGivenName || hasPhoneNumber || hasFamilyName;
    });
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            paddingBottom: 6,
            borderBottomColor: '#d9d8d7',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}>
          <SearchBar
            inputStyle={{
              fontSize: 16,
              letterSpacing: 0.1,
              fontFamily: 'SFProDisplay-Regular',
              padding: 1,
              width: '100%',
            }}
            placeholderText="Search for a name or number"
            placeholderTextColor="#8E8E95"
            growPercentage={0.935}
            onChangeText={this.handleSearch}
            inputValue={search}
          />
        </View>
        <FlatList
          style={{flex: 1}}
          data={data}
          renderItem={this.renderItem}
          ListHeaderComponent={this.ListHeaderComponent}
          initialNumToRender={10}
          ListEmptyComponent={this.ListEmptyComponent}
          keyExtractor={item => item.recordID}
          keyboardDismissMode="on-drag"
        />
      </View>
    );
  }
}

export default InviteContacts;
