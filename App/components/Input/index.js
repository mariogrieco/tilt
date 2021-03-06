import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  Alert,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Emoji} from '../../utils/TiltEmoji';
import {connect} from 'react-redux';
import Video from 'react-native-video';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import isEqual from 'lodash/isEqual';
import memoize from 'lodash/memoize';
import prettyBytes from 'pretty-bytes';
import themeTags from '../../themes/custom-tags';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import getIsCurrentFocusChannelPrivate from '../../selectors/getIsCurrentFocusChannelPrivate';
import {createPost, updatePost} from '../../actions/posts';
import Repost from '../Repost';
import {
  getHashTagChannelsNames,
  getDollarChannelNames,
} from '../../selectors/getChannelNames';
import ProfilePicture from './profile_picture';
import styles from './styles';
import {executeCommand} from '../../actions/commands';
import {
  generateId,
  encodeHeaderURIStringToUTF8,
  buildFileUploadData,
} from './file_utils';
import {getRepostById} from '../../selectors/getRepostById';
import {setRepostActiveOnInput} from '../../actions/repost';

import Client4 from '../../api/MattermostClient';
import assets from '../../config/themeAssets/assets';
const tagRegx = /\B(\#[a-z0-9_-]+)|(\#)/gi;
const dollarTagRegx = /\B(\$[a-z0-9_-]+)|(\$)/gi;
const mentionsRegx = /\B(\@[a-z0-9_-]+)|(\@)/gi;

const AT = require('../../../assets/themes/light/at/at.png');
const POST_TAGS = require('../../../assets/themes/light/tags/tag.png');
const FILE = require('../../../assets/themes/light/file/file.png');
// const FILE_DISABLED = require('../../../assets/themes/light/file_disabled/file_disabled.png');
const PHOTO = require('../../../assets/themes/light/photo/photo.png');
// const PHOTO_DISABLED = require('../../../assets/themes/light/photo_disabled/photo_disabled.png');
const VIDEO_THIN = require('../../../assets/themes/light/video_thin/video.png');
// const VIDEO_THIN_DISABLED = require('../../../assets/themes/light/video_disabled/video_disabled.png');
const SLASH = require('../../../assets/themes/light/slash/slash.png');

const WORD = require('../../../assets/themes/light/word-file/word.png');
const PDF = require('../../../assets/themes/light/pdf-file/pdf.png');
const EXCEL = require('../../../assets/themes/light/excel-file/excel.png');
const POWERPOINT = require('../../../assets/themes/light/powerpoint-file/powerpoint.png');
const AUDIO = require('../../../assets/themes/light/audio-file/audio.png');
const VIDEO = require('../../../assets/themes/light/video-file/video.png');
const IMAGE = require('../../../assets/themes/light/image-file/image.png');
const STANDARD_FILE = require('../../../assets/themes/light/standard-file/folder.png');

const getDisplayIconForFile = memoize(extension => {
  if (extension.includes('doc')) {
    return WORD;
  }
  if (extension.includes('docx')) {
    return WORD;
  }
  if (extension.includes('csv')) {
    return EXCEL;
  }
  if (extension.includes('xls')) {
    return EXCEL;
  }
  if (extension.includes('xlsx')) {
    return EXCEL;
  }
  if (extension.includes('pdf')) {
    return PDF;
  }
  if (extension.includes('ppt')) {
    return POWERPOINT;
  }
  if (extension.includes('pptx')) {
    return POWERPOINT;
  }
  if (extension.includes('mp3')) {
    return AUDIO;
  }
  if (extension.includes('mp4')) {
    return VIDEO;
  }
  if (extension.includes('jpg')) {
    return IMAGE;
  }
  if (extension.includes('gif')) {
    return IMAGE;
  }
  return STANDARD_FILE;
});

class Input extends React.Component {
  refInput = React.createRef();

  state = {
    messageText: '',
    showMentionsOptions: false,
    showCommandOptions: false,
    showHashTags: false,
    loading: false,
    showTags: false,
    showDollarTags: false,
    mentionsCount: 0,
    selection: {
      start: 0,
      end: 0,
    },
    filerDollarTagBuffer: [],
    filterMentionBuffer: [],
    filerTagBuffer: [],
    iterableInit: 0,
    iterableEnd: 0,
    uploadImages: [],
    uploadVideos: [],
    filesIds: [],
    uploadDocument: null,
    fileLoaders: [],
    textTags: [
      {
        text: 'Bullish',
        style: themeTags.Bullish,
      },
      {
        text: 'Bearish',
        style: themeTags.Bearish,
      },
      {
        text: 'YOLO',
        style: themeTags.Yolo,
      },
      {
        text: 'Shitpost',
        style: themeTags.Shitpost,
      },
      {
        text: 'Discussion',
        style: themeTags.Discussion,
      },
      {
        text: 'Satire',
        style: themeTags.Satire,
      },
      {
        text: 'Gain',
        style: themeTags.Gain,
      },
      {
        text: 'Loss',
        style: themeTags.Loss,
      },
      {
        text: 'Stocks',
        style: themeTags.Stocks,
      },
      {
        text: 'Options',
        style: themeTags.Options,
      },
      {
        text: 'Futures',
        style: themeTags.Futures,
      },
      {
        text: 'Cryptos',
        style: themeTags.Cryptos,
      },
      {
        text: 'Shrug',
        style: themeTags.Shrug,
      },
    ],
  };

  showOptionsView = value => {
    if (value === 1) {
      this.setState(prevState => {
        const {showMentionsOptions, filterMentionBuffer} = prevState;
        return {
          showMentionsOptions: !showMentionsOptions,
          showCommandOptions: false,
          filterMentionBuffer: !showMentionsOptions ? filterMentionBuffer : [],
          mentionsCount: !showMentionsOptions ? this.state.mentionsCount : 0,
        };
      });
    } else if (value === 2) {
      this.setState({
        showCommandOptions: !this.state.showCommandOptions,
        showMentionsOptions: false,
        // showDollarTags: false,
        filterMentionBuffer: [],
        mentionsCount: 0,
      });
    }
  };

  isCommand() {
    return this.state.messageText.trim()[0] === '/';
  }

  send = () => {
    if (this.state.loading) {
      return false;
    }
    if (this.isCommand()) {
      this.sendCommandMessage();
    } else if (this.props.editable) {
      this.sendEditableMessage();
    } else if (
      this.props.editable !== this.state.messageText &&
      this.state.messageText.trim().length > 0
    ) {
      this.sendNormalMessage();
    }
  };

  sendCommandMessage = () => {
    if (this.state.loading) {
      return false;
    }
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const {channelId} = this.props;
          const parsedValue = Emoji.parse(this.state.messageText);
          await this.props.executeCommand(parsedValue, channelId);
        } catch (err) {
          alert(err.message || err);
        } finally {
          this.setState({
            loading: false,
            messageText: '',
          });
          this.blurInput();
          this.clearState();
          this.closeCommands();
        }
      },
    );
  };

  sendEditableMessage = () => {
    if (this.state.loading) {
      return false;
    }
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const {post} = this.props;
          const parsedValue = Emoji.parse(this.state.messageText);
          let file_ids = [];
          if (post.metadata.files) {
            file_ids = post.metadata.files.map(({id}) => id);
          }
          if (post.props) {
            if (post.percent_change) {
              const percent_change = await this.getEditedPropsValues();
              if (percent_change) {
                const nextProps = {};
                Object.keys(post.props.percent_change).map(key => {
                  if (percent_change.indexOf(key) !== -1) {
                    if (percent_change[key] !== '') {
                      nextProps[key] = percent_change[key];
                    }
                  }
                });
                post.props.percent_change = nextProps;
              } else {
                post.props.percent_change = null;
                delete post.props.percent_change;
              }
            }
          }

          await this.props.updatePost({
            ...post,
            message: parsedValue,
            file_ids,
          });
        } catch (ex) {
          alert(ex.message || ex);
        } finally {
          this.setState({
            loading: false,
            messageText: '',
          });
          this.blurInput();
          this.clearState();
          if (this.props.onEditCallback) {
            this.props.onEditCallback();
          }
        }
      },
    );
  };

  sendNormalMessage = () => {
    if (this.state.loading) {
      return false;
    }
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          const {messageText, filesIds} = this.state;
          const {channelId, root_id, repost_id} = this.props;
          const parsedValue = Emoji.parse(messageText);
          const percent_change = await this.getDollarValuesProps();
          const props = {};
          props.repost = repost_id;
          if (percent_change !== null) {
            props.percent_change = percent_change;
          }
          await this.props.createPost(
            parsedValue,
            channelId,
            root_id,
            filesIds,
            props,
          );
          this.setState({
            messageText: '',
          });
        } catch (ex) {
          console.log(ex);
          alert(ex.message || ex);
        } finally {
          this.blurInput();
          this.setState({
            loading: false,
          });
          this.clearState();
          this.props.setRepostActiveOnInput(null);
        }
      },
    );
  };

  blurInput() {
    if (this.refInput && this.refInput.current) {
      this.refInput.current.blur();
    }
  }

  onChangeMessage = value => {
    if (value.charAt(0) === '/') {
      this.setState({
        showCommandOptions: true,
      });
    } else {
      this.setState({
        showCommandOptions: false,
      });
    }

    this.setState(
      {
        messageText: value,
      },
      this.checkForMentionsOrTags,
    );
  };

  filterDollarTags() {
    const nextTags = this.props.channelDollarTagNames.filter(tag => {
      const userString = `$${tag.toLowerCase()}`;
      const indexFocus = this.state.currentDollarTagTextFocused;
      const inputValue = this.state.filerDollarTagBuffer;
      if (
        inputValue &&
        inputValue[indexFocus] &&
        inputValue[indexFocus].trim() !== ''
      ) {
        const match = !!userString.match(
          inputValue[indexFocus]
            .toLowerCase()
            .trim()
            .replace('$', ''),
        );
        return match;
      }
      return true;
    });
    if (nextTags.length !== 0) {
      return nextTags;
    }
    this.closeDollarTags();
    return nextTags;
  }

  filterTags() {
    const nextTags = this.props.channelTagNames.filter(tag => {
      const userString = `#${tag.toLowerCase()}`;
      const indexFocus = this.state.currentTagTextFocused;
      const inputValue = this.state.filerTagBuffer;
      if (
        inputValue &&
        inputValue[indexFocus] &&
        inputValue[indexFocus].trim() !== ''
      ) {
        const match = !!userString.match(
          inputValue[indexFocus].toLowerCase().trim(),
        );
        return match;
      }
      return true;
    });
    if (nextTags.length !== 0) {
      return nextTags;
    }
    this.closeTags();
    return nextTags;
  }

  filterUsers() {
    const nextUsers = this.props.users.filter(({username}) => {
      const userString = `@${username.toLowerCase()}`;
      const indexFocus = this.state.currentMentionTextFocused;
      const inputValue = this.state.filterMentionBuffer;
      if (
        inputValue &&
        inputValue[indexFocus] &&
        inputValue[indexFocus].trim() !== ''
      ) {
        const match = !!userString.match(
          inputValue[indexFocus].toLowerCase().trim(),
        );
        return match;
      }
      return true;
    });
    if (nextUsers.length !== 0) {
      return nextUsers;
    }
    this.closeMentions();
    return nextUsers;
  }

  filterCommands() {
    const commands = this.props.commands.filter(command => {
      const stringCommand = `/${command.trigger.toLowerCase()}`;
      const inputValue = this.state.messageText
        ? this.state.messageText.toLowerCase()
        : '';
      if (this.state.messageText.length > 1) {
        return stringCommand.match(inputValue);
      }
      return true;
    });
    if (commands.length === 0) {
      this.closeCommands();
    }
    return commands;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  getMentionsComponent() {
    const {theme} = this.props;
    return (
      <ScrollView
        style={[
          styles.showOptionsView,
          {borderBottomColor: theme.borderBottomColor},
        ]}>
        {this.filterUsers().map((user, index) => (
          <TouchableHighlight
            underlayColor="#17C491"
            onPress={() => {
              this.interpolateStrToMessage(`${user.username}`, '@');
            }}>
            <View style={styles.mentions}>
              <Image
                style={styles.mentionsProfileImage}
                source={{
                  uri: getUserProfilePicture(user.id, user.last_picture_update),
                }}
              />
              <Text
                style={[
                  styles.commandContainer,
                  styles.mentionsColor,
                  {color: theme.primaryTextColor},
                ]}
                key={index}>
                @{user.username}
              </Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
    );
  }

  executeCommands = trigger => {
    try {
      this.setState({
        messageText: trigger,
      });
      this.closeCommands();
    } catch (ex) {}
  };

  closeCommands() {
    this.setState({
      showCommandOptions: false,
    });
  }

  getCommandComponent() {
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.showOptionsView,
          {borderBottomColor: theme.borderBottomColor},
        ]}>
        <ScrollView style={{backgroundColor: theme.primaryBackgroundColor}}>
          {this.filterCommands().map((data, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() => {
                this.executeCommands(data.trigger);
              }}>
              <View style={styles.commandContainer} key={index}>
                <Text
                  style={[styles.commandExec, {color: theme.primaryTextColor}]}>
                  {data.trigger}
                </Text>
                <Text
                  style={[
                    styles.commandDescription,
                    {color: theme.primaryTextColor},
                  ]}>
                  {data.name}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  }

  getTagComponent() {
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.showOptionsView,
          {borderBottomColor: theme.borderBottomColor},
        ]}>
        <ScrollView style={{backgroundColor: theme.primaryBackgroundColor}}>
          {this.filterTags().map((name, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() =>
                this.interpolateStrToMessage(`${name.toLowerCase()}`, '#')
              }>
              <View style={styles.commandTagContainer} key={index}>
                <Text style={[styles.hashTag, {color: theme.primaryTextColor}]}>
                  #{name.toLowerCase()}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  }

  interpolateStrToMessage(str, type) {
    const {
      iterableInit,
      iterableEnd,
      messageText,
      // selection
    } = this.state;
    const nextState = `${messageText.slice(
      0,
      iterableInit,
    )}${type}${str.trim()}${messageText.slice(
      iterableEnd,
      messageText.length,
    )} `;
    this.setState({
      messageText: nextState,
    });
    this.closeTags();
    this.closeMentions();
    this.closeDollarTags();
  }

  determineIfOpenMentions() {
    const {selection, messageText} = this.state;
    const patt = mentionsRegx;
    const matches = messageText.match(mentionsRegx);
    const startCursor = selection.start;
    let currentIndex = null;
    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }
    return currentIndex !== null;
  }

  determineIfOpenDollarTags() {
    const {selection, messageText} = this.state;
    const patt = dollarTagRegx;
    const matches = messageText.match(dollarTagRegx);
    const startCursor = selection.start;
    let currentIndex = null;
    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iterableEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return currentIndex !== null;
  }

  getPropsEditValuesFor () {
    const patt = dollarTagRegx;
    let match = null;
    const {messageText} = this.state;
    const matches = messageText.match(dollarTagRegx);
    let propsFor = [];
    while ((match = patt.exec(messageText))) {
      if (match[0]) {
        propsFor.push(match[0].replace('$', ''));
      }
    }

    return propsFor;
  }

   getDollarValuesProps = async () => {
    const patt = dollarTagRegx;
    let match = null;
    const {messageText} = this.state;
    const matches = messageText.match(dollarTagRegx);
    let propsFor = [];
    while ((match = patt.exec(messageText))) {
      if (match[0]) {
        propsFor.push(match[0].replace('$', ''));
      }
    }

    if (propsFor.length === 0) {
      return null;
    }

    return await this.getValuesFor(propsFor);
  };

  getEditedPropsValues() {
    const patt = dollarTagRegx;
    let match = null;
    const {messageText} = this.state;
    const matches = messageText.match(dollarTagRegx);
    let propsFor = [];
    while ((match = patt.exec(messageText))) {
      if (match[0]) {
        propsFor.push(match[0].replace('$', ''));
      }
    }
    if (propsFor.length === 0) {
      return null;
    }
    return propsFor;
  }

   getValuesFor = async propsFor => {
    const allProps = {};

    for (let index = 0; index < propsFor.length; index++) {
      const name = propsFor[index];
      try {
        const {data} = await Client4.getSymbolPercentChange(name);
        if (data !== '') {
          allProps[name] = data;
        }
      } catch (err) {
        console.log(err);
      }
    }

    return allProps;
  };

  determineIfOpenTags() {
    const {selection, messageText} = this.state;
    const patt = tagRegx;
    const matches = messageText.match(tagRegx);
    const startCursor = selection.start;
    let currentIndex = null;
    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iterableEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return currentIndex !== null;
  }

  checkForMentionsOrTags() {
    const {
      messageText,
      selection,
      showMentionsOptions,
      showHashTags,
    } = this.state;

    if (messageText.trim() === '') {
      this.closeMentions();
      this.closeTags();
      this.closeDollarTags();
      return null;
    }

    // users types @ or #
    const nexMentionstMatch = messageText.slice(
      selection.start - 2,
      selection.start,
    );
    const nextTagMatch = messageText.slice(
      selection.start - 2,
      selection.start,
    );

    let tags = false;
    let mentions = false;
    let dollarTags = false;

    if (nexMentionstMatch.includes('@') || this.determineIfOpenMentions()) {
      mentions = true;
      this.setState({
        showMentionsOptions: true,
        showHashTags: false,
        showDollarTags: false,
        filerTagBuffer: [],
      });
    } else if (nextTagMatch.includes('#') || this.determineIfOpenTags()) {
      tags = true;
      this.setState({
        showHashTags: true,
        showMentionsOptions: false,
        showDollarTags: false,
        filterMentionBuffer: [],
      });
    } else if (nextTagMatch.includes('$') || this.determineIfOpenDollarTags()) {
      dollarTags = true;
      this.setState({
        showDollarTags: true,
        showHashTags: false,
        showMentionsOptions: false,
        filerDollarTagBuffer: [],
      });
    } else if (nextTagMatch.includes(' ')) {
      this.closeMentions();
      this.closeTags();
      this.closeDollarTags();
    }

    // find rgex and index for each posible case only mentions or #
    if (mentions) {
      const restOfMatchs = messageText.match(mentionsRegx);
      const {
        iterableInit,
        iterableEnd,
        currentIndex,
      } = this.calculateCurrentMentionFocus(selection, restOfMatchs);

      this.setState({
        filterMentionBuffer: restOfMatchs,
        currentMentionTextFocused: currentIndex,
        iterableInit,
        iterableEnd,
      });
    } else if (tags) {
      const restOfMatchs = messageText.match(tagRegx);
      const {
        iterableInit,
        iterableEnd,
        currentIndex,
      } = this.calculateCurrentTagFocus(selection, restOfMatchs);

      this.setState({
        filerTagBuffer: restOfMatchs,
        currentTagTextFocused: currentIndex,
        iterableInit,
        iterableEnd,
      });
    } else if (dollarTags) {
      const restOfMatchs = messageText.match(dollarTagRegx);
      const {
        iterableInit,
        iterableEnd,
        currentIndex,
      } = this.calculateCurrentDollarTagFocus(selection, restOfMatchs);
      this.setState({
        filerDollarTagBuffer: restOfMatchs,
        currentDollarTagTextFocused: currentIndex,
        iterableInit,
        iterableEnd,
      });
    }
  }

  calculateCurrentDollarTagFocus(selections, matches = []) {
    const patt = dollarTagRegx;
    const startCursor = selections.start;
    const {messageText} = this.state;
    let currentIndex = null;
    let iterableInit = 0;
    let iterableEnd = 0;

    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iterableEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return {
      currentIndex: currentIndex || 0,
      iterableEnd,
      iterableInit,
    };
  }

  calculateCurrentTagFocus(selections, matches = []) {
    const patt = tagRegx;
    const startCursor = selections.start;
    const {messageText} = this.state;
    let currentIndex = null;
    let iterableInit = 0;
    let iterableEnd = 0;

    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iterableEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return {
      currentIndex: currentIndex || 0,
      iterableEnd,
      iterableInit,
    };
  }

  calculateCurrentMentionFocus(selections, matches = []) {
    const patt = mentionsRegx;
    const startCursor = selections.start;
    const {messageText} = this.state;
    let currentIndex = null;
    let iterableInit = 0;
    let iterableEnd = 0;

    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iterableEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return {
      currentIndex: currentIndex || 0,
      iterableEnd,
      iterableInit,
    };
  }

  closeTags() {
    this.setState({
      showHashTags: false,
      filerTagBuffer: [],
    });
  }

  closeDollarTags() {
    this.setState({
      showDollarTags: false,
      filerDollarTagBuffer: [],
    });
  }

  closeMentions() {
    this.setState({
      showMentionsOptions: false,
      filterMentionBuffer: [],
    });
  }

  componentDidMount() {
    const {editable} = this.props;
    if (editable) {
      this.setState({
        messageText: editable,
      });
    }
  }

  isDisable() {
    return !(this.state.messageText && this.state.messageText.trim() !== '');

    if (this.state.filesIds.length > 0) {
      return false;
    }
  }

  onSelectionChange = e => {
    this.setState(
      {
        selection: e.nativeEvent.selection,
      },
      this.checkForMentionsOrTags,
    );
  };

  getFileId() {
    return this.state.filesIds;
  }

  pushFileId(id) {
    const nextState = [...this.state.filesIds];
    nextState.push(id);
    this.setState({
      filesIds: nextState,
    });
  }

  removeFileId(id) {
    const nextState = [...this.state.filesIds].filter(_id => _id !== id);
    this.setState({
      filesIds: nextState,
    });
  }

  prepareFileToUpload(data) {
    const file = new FormData();
    const id = generateId();
    let formBoundary;
    if (Platform.OS === 'ios') {
      formBoundary = '--mobile.client.file.upload';
    }
    data.name = encodeHeaderURIStringToUTF8(data.fileName);
    file.append('files', data);
    file.append('channel_id', this.props.channelId);
    file.append('client_ids', id);
    return {
      formBoundary,
      file,
      id,
    };
  }

  addFileLoader = () => {
    const fileLoaders = [...this.state.fileLoaders];
    fileLoaders.push(1);
    this.setState({
      fileLoaders,
    });
  };

  removeFileLoader = () => {
    const fileLoaders = [...this.state.fileLoaders];
    fileLoaders.pop();
    this.setState({
      fileLoaders,
    });
  };

  handleImageUpload = () => {
    const {uploadImages} = this.state;

    if (uploadImages.length + 1 > 1) {
      Alert.alert('', 'You can only upload 1 photo at this time.');
      return;
    }

    const options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      noData: false,
    };

    ImagePicker.launchImageLibrary(options, async response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.addFileLoader();
        console.log('image picked', response);
        const preparedFile = this.prepareFileToUpload(response);
        const {formBoundary, file} = preparedFile;
        console.log('image prepared', preparedFile);

        try {
          await setTimeout(async () => {
            const file_uploaded = await Client4.uploadFile(file, formBoundary);
            file_uploaded.file_infos.forEach(element => {
              this.pushFileId(element.id);
              const source = {uri: response.uri};
              this.setState(state => {
                const images = [...state.uploadImages];
                images.push({
                  ...source,
                  id: element.id,
                });
                return {
                  uploadImages: images,
                };
              });
            });
            this.removeFileLoader();
          }, 0);
        } catch (err) {
          this.removeFileLoader();
          // this.addErrorOnLoad()
          console.log('err', err);
          alert(err.message || err);
        } finally {
        }
      }
    });
  };

  clearState() {
    this.setState({
      uploadDocument: null,
      uploadVideos: [],
      uploadImages: [],
      fileLoaders: [],
      filesIds: [],
    });
  }

  handleVideoUpload = () => {
    const {uploadVideos} = this.state;

    if (uploadVideos.length + 1 > 1) {
      Alert.alert('', 'You can only upload 1 video at this time.');
      return;
    }

    const options = {
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'movies',
      },
      noData: false,
    };

    ImagePicker.launchImageLibrary(options, async response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.addFileLoader();
        console.log('video picked', response);
        response = buildFileUploadData(response);
        console.log('video after build', response);
        try {
          console.log(response);
          const {formBoundary, file, id} = this.prepareFileToUpload(response);
          const file_uploaded = await Client4.uploadFile(file, formBoundary);
          file_uploaded.file_infos.forEach(element => {
            this.pushFileId(element.id);
            const source = {uri: response.uri};
            this.setState(state => {
              const videos = [...state.uploadVideos];
              videos.push({
                ...source,
                id: element.id,
              });
              return {
                uploadVideos: videos,
              };
            });
          });
        } catch (err) {
          alert(`${err.message || err}`);
        } finally {
          this.removeFileLoader();
        }
      }
    });
  };

  handleDocumentUpload = async () => {
    try {
      const iosTypes = [
        'org.openxmlformats.wordprocessingml.document',
        'com.adobe.pdf',
        'org.openxmlformats.spreadsheetml.sheet',
        'org.openxmlformats.presentationml.presentation',
        'public.movie',
        'public.audio',
        'public.text',
        'public.image',
      ];

      const androidTypes = [
        'application/json',
        'application/msword',
        'application/pdf',
        'application/rtf',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/xml',
        'text/csv',
        'text/plain',
      ];

      const types = Platform.OS === 'android' ? androidTypes : iosTypes;

      let res = await DocumentPicker.pick({
        type: [...types],
      });
      this.addFileLoader();
      console.log('file picked', res);
      res = buildFileUploadData(res);
      console.log('res after build', res);
      const document = null;

      try {
        const {formBoundary, file, id} = this.prepareFileToUpload(res);
        const file_uploaded = await Client4.uploadFile(file, formBoundary);
        // console.log('done!: ', file_uploaded);
        file_uploaded.file_infos.forEach(element => {
          const icon = getDisplayIconForFile(res.extension);
          this.pushFileId(element.id);
          // console.log(res, element, icon)
          this.setState({
            uploadDocument: {
              name: element.name,
              size: element.size,
              id: element.id,
              icon,
            },
          });
        });
      } catch (err) {
        alert(err.message || err);
      }
    } catch (err) {
      this.removeFileLoader();
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
      } else {
        // For Unknown Error
        throw err;
      }
    } finally {
      this.removeFileLoader();
    }
  };

  handleDeleteImage = (deleteRef, id) => () => {
    this.removeFileId(id);
    this.setState(state => {
      const {uploadImages} = state;
      return {
        uploadImages: uploadImages.filter((item, index) => deleteRef !== index),
      };
    });
  };

  handleDeleteVideo = (deleteRef, id) => () => {
    this.removeFileId(id);
    this.setState(state => {
      const {uploadVideos} = state;
      return {
        uploadVideos: uploadVideos.filter((item, index) => deleteRef !== index),
      };
    });
  };

  handleDeleteDocument = () => {
    this.setState(() => ({
      uploadDocument: null,
      filesIds: [],
    }));
  };

  renderLoadingImages = () => {
    const items = this.state.fileLoaders.map((i, index) => (
      <View style={styles.mediaUpload} key={index}>
        <ActivityIndicator color="#17C491" />
      </View>
    ));
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 15,
          flexWrap: 'wrap',
        }}>
        {items}
      </View>
    );
  };

  getDollarTagsComponent() {
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.showOptionsView,
          {borderBottomColor: theme.borderBottomColor},
        ]}>
        <ScrollView>
          {this.filterDollarTags().map((name, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() =>
                this.interpolateStrToMessage(`${name.toLowerCase()}`, '$')
              }>
              <View style={styles.commandTagContainer} key={index}>
                <Text style={[styles.hashTag, {color: theme.primaryTextColor}]}>
                  ${name.toUpperCase()}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  }

  closeTextTags = () => {
    this.setState({
      showTags: false,
    });
  };

  openTextTags = () => {
    this.setState({
      showTags: !this.state.showTags,
    });
  };

  interpolateTextTag = str => {
    const {selection, messageText} = this.state;
    this.setState({
      messageText: `${messageText.slice(
        0,
        selection.start,
      )}-${str}- ${messageText.slice(selection.start, messageText.length)}`,
      showTags: false,
    });
  };

  renderTextTag() {
    const {theme} = this.props;
    return (
      <View
        style={[
          styles.showOptionsView,
          {borderBottomColor: theme.borderBottomColor},
        ]}>
        <ScrollView>
          <TouchableHighlight
            underlayColor="#17C491"
            onPress={this.closeTextTags}>
            <View style={[styles.commandTagContainer]} key={'none'}>
              <Text
                style={[
                  styles.customTagNoneTextStyle,
                  {color: theme.primaryTextColor},
                ]}>
                None
              </Text>
            </View>
          </TouchableHighlight>
          {this.state.textTags.map(tag => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() => {
                this.interpolateTextTag(tag.text);
              }}>
              <View style={styles.commandTagContainer} key={tag.text}>
                <Text
                  style={[
                    tag.style,
                    tag.text === 'Shrug' ? {color: theme.primaryTextColor} : {},
                  ]}>
                  {tag.text}
                </Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  }

  render() {
    const {
      placeholder,
      loggedUserPicture,
      isPrivateChannel,
      isReadOnlyChannel,
      repost,
    } = this.props;
    const {
      messageText,
      showMentionsOptions,
      showCommandOptions,
      showHashTags,
      uploadImages,
      uploadVideos,
      uploadDocument,
      showDollarTags,
      showTags,
    } = this.state;
    console.log('repost: ', repost);
    const {theme, themeName} = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.primaryBackgroundColor,
            borderTopColor: theme.borderBottomColor,
            borderBottomColor: theme.borderBottomColor,
          },
        ]}>
        {showMentionsOptions &&
          !isPrivateChannel &&
          this.getMentionsComponent()}
        {showCommandOptions && this.getCommandComponent()}
        {showHashTags && this.getTagComponent()}
        {showDollarTags && this.getDollarTagsComponent()}
        {showTags && this.renderTextTag()}
        <View style={{flexDirection: 'row'}}>
          <ProfilePicture loggedUserPicture={loggedUserPicture} />
          <View
            style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 10 : null}}>
            <TextInput
              keyboardType="default"
              dataDetectorTypes="all"
              value={messageText}
              placeholder={
                isReadOnlyChannel ? 'This channel is read-only' : placeholder
              }
              placeholderTextColor={theme.placeholderTextColor}
              style={[styles.input, {color: theme.primaryTextColor}]}
              ref={this.refInput}
              onSelectionChange={this.onSelectionChange}
              onChangeText={this.onChangeMessage}
              autoCorrect
              multiline
              underlineColorAndroid="transparent"
              allowFontScaling
              editable={!isReadOnlyChannel}
              selectionColor={theme.tiltGreen}
              keyboardAppearance={theme.keyboardAppearanceColor}
            />
            {repost && (
              <Repost
                postId={repost.id}
                userId={repost.user.id}
                last_picture_update={repost.user.last_picture_update}
                message={repost.message}
                username={repost.user.username}
                metadata={repost.metadata}
                create_at={repost.create_at}
                replies={repost.replies}
                edit_at={repost.edit_at}
                type={repost.type}
                isPM={false}
                post_props={repost.props}
              />
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 6,
            flexWrap: 'wrap',
          }}>
          {uploadImages.map(({uri, id}, index) => (
            <View style={styles.mediaContainer} key={id}>
              <Image
                source={{uri}}
                style={[
                  styles.mediaUpload,
                  {borderColor: theme.mediaBorderColor},
                ]}
              />
              <View style={styles.deleteMedia}>
                <TouchableWithoutFeedback
                  onPress={this.handleDeleteImage(index, id)}>
                  <Image source={assets[themeName].DELETE_ITEM} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          ))}
          {uploadVideos.map(({uri, id}, index) => (
            <View style={styles.mediaContainer} key={id}>
              <Video
                source={{uri}}
                style={[
                  styles.mediaUpload,
                  {borderColor: theme.mediaBorderColor},
                ]}
                volume={0.0}
                resizeMode="stretch"
              />
              <View style={styles.deleteMedia}>
                <TouchableWithoutFeedback
                  onPress={this.handleDeleteVideo(index, id)}>
                  <Image source={assets[themeName].DELETE_ITEM} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          ))}
          {this.renderLoadingImages()}
          {uploadDocument && (
            <View
              style={[
                styles.documentContainer,
                {borderColor: theme.mediaBorderColor},
              ]}>
              <View
                style={{
                  paddingRight: 15,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Image source={uploadDocument.icon} />
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={[
                    styles.documentName,
                    {color: theme.primaryTextColor},
                  ]}>
                  {uploadDocument.name}
                </Text>
                <Text style={{color: theme.primaryTextColor}}>
                  {prettyBytes(uploadDocument.size)}
                </Text>
              </View>
              <View style={styles.deleteDocument}>
                <TouchableWithoutFeedback onPress={this.handleDeleteDocument}>
                  <Image source={assets[themeName].DELETE_ITEM} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.leftElements}>
            {!isPrivateChannel ? (
              <TouchableOpacity
                onPress={() => this.showOptionsView(1)}
                style={{paddingHorizontal: 10, paddingBottom: 5}}>
                <Image source={AT} />
              </TouchableOpacity>
            ) : (
              <View
                style={{opacity: 0.5, paddingHorizontal: 10, paddingBottom: 5}}>
                <Image source={AT} />
              </View>
            )}
            <TouchableOpacity
              onPress={() => this.showOptionsView(2)}
              style={{paddingHorizontal: 10, paddingBottom: 5}}>
              <Image source={SLASH} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.openTextTags}
              style={{paddingHorizontal: 10, paddingBottom: 5}}>
              <Image source={POST_TAGS} />
            </TouchableOpacity>
          </View>
          <View style={[styles.rightElements]}>
            <TouchableOpacity
              onPress={this.handleImageUpload}
              style={{paddingHorizontal: 10, paddingBottom: 5}}
              disabled={uploadVideos.length !== 0 || !!uploadDocument}>
              <Image source={PHOTO} style={styles.inputOption} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleVideoUpload}
              style={{paddingHorizontal: 10, paddingBottom: 5}}
              disabled={uploadImages.length !== 0 || !!uploadDocument}>
              <Image source={VIDEO_THIN} style={styles.inputOption} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handleDocumentUpload}
              style={{paddingLeft: 10, paddingRight: 15, paddingBottom: 5}}
              disabled={
                uploadVideos.length !== 0 ||
                uploadImages.length !== 0 ||
                !!uploadDocument
              }>
              <Image source={FILE} style={styles.inputOption} />
            </TouchableOpacity>
            <TouchableOpacity>
              {this.isDisable() || isReadOnlyChannel ? (
                <Text
                  style={[
                    styles.button,
                    styles.disabled,
                    {backgroundColor: theme.primaryBackgroundColor},
                  ]}>
                  Send
                </Text>
              ) : (
                <Text
                  style={[styles.button, {color: theme.buttonTextColor}]}
                  onPress={this.send}>
                  Send
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.themes[state.themes.current],
  themeName: state.themes.current,
  repost: getRepostById(state),
  repost_id: state.repost,
  commands: state.commands.map(({name, trigger}) => ({name, trigger})),
  users: state.users.keys
    .filter(key => !state.sponsored.includes(key))
    .map(key => (state.users.data[key] ? state.users.data[key] : {})),
  channelTagNames: getHashTagChannelsNames(state), // state.channelsTagNames
  channelDollarTagNames: getDollarChannelNames(state),
  loggedUserPicture: state.login.user
    ? getUserProfilePicture(
        state.login.user.id,
        state.login.user.last_picture_update,
      )
    : '',
  isPrivateChannel: getIsCurrentFocusChannelPrivate(state),
  isReadOnlyChannel:
    state.appNavigation.active_channel_id === 'z6ber8kptif9zc3os7gsxuxguc'
      ? !state.login.user.roles.includes('admin')
      : false,
});

const mapDispatchToProps = {
  createPost,
  updatePost,
  executeCommand,
  setRepostActiveOnInput,
};

export default connect(mapStateToProps, mapDispatchToProps)(Input);
