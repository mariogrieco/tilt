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
const DELETE = require('../../../assets/themes/light/delete-image-from-input/blackCircleCancel.png');
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
          await this.props.createPost(
            parsedValue,
            channelId,
            root_id,
            filesIds,
            {repost: repost_id},
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
    return (
      <ScrollView style={styles.showOptionsView}>
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
                style={[styles.commandContainer, styles.mentionsColor]}
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
    return (
      <View style={styles.showOptionsView}>
        <ScrollView>
          {this.filterCommands().map((data, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() => {
                this.executeCommands(data.trigger);
              }}>
              <View style={styles.commandContainer} key={index}>
                <Text style={styles.commandExec}>{data.trigger}</Text>
                <Text style={styles.commandDescription}>{data.name}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  }

  getTagComponent() {
    return (
      <View style={styles.showOptionsView}>
        <ScrollView>
          {this.filterTags().map((name, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() =>
                this.interpolateStrToMessage(`${name.toLowerCase()}`, '#')
              }>
              <View style={styles.commandTagContainer} key={index}>
                <Text style={styles.hashTag}>#{name.toLowerCase()}</Text>
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
    return (
      <View style={styles.showOptionsView}>
        <ScrollView>
          {this.filterDollarTags().map((name, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() =>
                this.interpolateStrToMessage(`${name.toLowerCase()}`, '$')
              }>
              <View style={styles.commandTagContainer} key={index}>
                <Text style={styles.hashTag}>${name.toLowerCase()}</Text>
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
    return (
      <View style={styles.showOptionsView}>
        <ScrollView>
          <TouchableHighlight
            underlayColor="#17C491"
            onPress={this.closeTextTags}>
            <View style={styles.commandTagContainer} key={'none'}>
              <Text style={styles.customTagNoneTextStyle}>None</Text>
            </View>
          </TouchableHighlight>
          {this.state.textTags.map((tag, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() => {
                this.interpolateTextTag(tag.text);
              }}>
              <View style={styles.commandTagContainer} key={index}>
                <Text style={[tag.style]}>{tag.text}</Text>
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
      repost
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
    return (
      <View style={styles.container}>
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
              style={styles.input}
              ref={this.refInput}
              onSelectionChange={this.onSelectionChange}
              onChangeText={this.onChangeMessage}
              autoCorrect
              multiline
              underlineColorAndroid="transparent"
              allowFontScaling
              editable={!isReadOnlyChannel}
            />
            {repost && (
              <Repost
                postId={repost.id}
                userId={repost.user.id}
                last_picture_update={repost.user.last_picture_update}
                message={repost.message}
                username={repost.user.username}
                metadata={repost.metadata}
                createdAt={repost.create_at}
                replies={repost.replies}
                edit_at={repost.edit_at}
                type={repost.type}
                isPM={false}
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
              <Image source={{uri}} style={styles.mediaUpload} />
              <View style={styles.deleteMedia}>
                <TouchableWithoutFeedback
                  onPress={this.handleDeleteImage(index, id)}>
                  <Image source={DELETE} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          ))}
          {uploadVideos.map(({uri, id}, index) => (
            <View style={styles.mediaContainer} key={id}>
              <Video
                source={{uri}}
                style={styles.mediaUpload}
                volume={0.0}
                resizeMode="stretch"
              />
              <View style={styles.deleteMedia}>
                <TouchableWithoutFeedback
                  onPress={this.handleDeleteVideo(index, id)}>
                  <Image source={DELETE} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          ))}
          {this.renderLoadingImages()}
          {uploadDocument && (
            <View style={styles.documentContainer}>
              <View
                style={{
                  paddingRight: 15,
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Image source={uploadDocument.icon} />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.documentName}>{uploadDocument.name}</Text>
                <Text>{prettyBytes(uploadDocument.size)}</Text>
              </View>
              <View style={styles.deleteDocument}>
                <TouchableWithoutFeedback onPress={this.handleDeleteDocument}>
                  <Image source={DELETE} />
                </TouchableWithoutFeedback>
              </View>
            </View>
          )}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.leftElements}>
            {!isPrivateChannel ? (
              <TouchableHighlight
                underlayColor="rgba(63, 184, 127, 0.2)"
                onPress={() => this.showOptionsView(1)}>
                <Image source={AT} />
              </TouchableHighlight>
            ) : (
              <View style={{opacity: 0.5}}>
                <Image source={AT} />
              </View>
            )}
            <TouchableHighlight
              underlayColor="rgba(63, 184, 127, 0.2)"
              onPress={() => this.showOptionsView(2)}>
              <Image source={SLASH} />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="rgba(63, 184, 127, 0.2)"
              onPress={this.openTextTags}>
              <Image source={POST_TAGS} />
            </TouchableHighlight>
          </View>
          <View style={[styles.rightElements]}>
            <TouchableHighlight
              underlayColor="rgba(63, 184, 127, 0.2)"
              onPress={this.handleImageUpload}
              disabled={uploadVideos.length !== 0 || !!uploadDocument}>
              <Image source={PHOTO} style={styles.inputOption} />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor="rgba(63, 184, 127, 0.2)"
              onPress={this.handleVideoUpload}
              disabled={uploadImages.length !== 0 || !!uploadDocument}>
              <Image source={VIDEO_THIN} style={styles.inputOption} />
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.handleDocumentUpload}
              underlayColor="rgba(63, 184, 127, 0.2)"
              disabled={
                uploadVideos.length !== 0 ||
                uploadImages.length !== 0 ||
                !!uploadDocument
              }>
              <Image source={FILE} style={styles.inputOption} />
            </TouchableHighlight>
            <TouchableOpacity>
              {this.isDisable() || isReadOnlyChannel ? (
                <Text style={[styles.button, styles.disabled]}>Send</Text>
              ) : (
                <Text style={styles.button} onPress={this.send}>
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

const mapDisptchToProps = {
  createPost,
  updatePost,
  executeCommand,
  setRepostActiveOnInput,
};

export default connect(
  mapStateToProps,
  mapDisptchToProps,
)(Input);
