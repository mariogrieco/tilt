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
import parserFactory from 'emogeez-parser';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';
import getIsCurrentFocusChannelPrivate from '../../selectors/getIsCurrentFocusChannelPrivate';
import {createPost, updatePost} from '../../actions/posts';
import {
  getHashTagChannelsNames,
  getDolarChannelNames,
} from '../../selectors/getChannelNames';
import ProfilePicture from './profile_picture';
import styles from './styles';
import {executeCommand} from '../../actions/commands';
import {
  generateId,
  encodeHeaderURIStringToUTF8,
  buildFileUploadData,
} from './file_utils';
// import RNFetchBlob from 'rn-fetch-blob';

import Client4 from '../../api/MattermostClient';

const {store, replacer, matcher} = parserFactory();

const tagRegx = /\B(\#[a-z0-9_-]+)|(\#)/gi;
const dolarTagRegx = /\B(\$[a-z0-9_-]+)|(\$)/gi;
const mentionsRegx = /\B(\@[a-z0-9_-]+)|(\@)/gi;

const AT = require('../../../assets/images/at/at.png');
const FILE = require('../../../assets/images/file/file.png');
// const FILE_DISABLED = require('../../../assets/images/file_disabled/file_disabled.png');
const PHOTO = require('../../../assets/images/photo/photo.png');
// const PHOTO_DISABLED = require('../../../assets/images/photo_disabled/photo_disabled.png');
const VIDEO_THIN = require('../../../assets/images/video_thin/video.png');
// const VIDEO_THIN_DISABLED = require('../../../assets/images/video_disabled/video_disabled.png');
const SLASH = require('../../../assets/images/slash/slash.png');
const DELETE = require('../../../assets/images/delete-image-from-input/blackCircleCancel.png');
const WORD = require('../../../assets/images/word-file/word.png');
const PDF = require('../../../assets/images/pdf-file/pdf.png');
const EXCEL = require('../../../assets/images/excel-file/excel.png');
const POWERPOINT = require('../../../assets/images/powerpoint-file/powerpoint.png');
const AUDIO = require('../../../assets/images/audio-file/audio.png');
const VIDEO = require('../../../assets/images/video-file/video.png');
const IMAGE = require('../../../assets/images/image-file/image.png');
const STANDARD_FILE = require('../../../assets/images/standard-file/folder.png');

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
    showComandOptions: false,
    showTags: false,
    loading: false,
    showDolarTags: false,
    mentionsCount: 0,
    selection: {
      start: 0,
      end: 0,
    },
    filerDolarTagBuffer: [],
    filterMentionBuffer: [],
    filerTagBuffer: [],
    iterableInit: 0,
    iteralbeEnd: 0,
    uploadImages: [],
    uploadVideos: [],
    filesIds: [],
    uploadDocument: null,
    fileLoaders: [],
  };

  showOptionsView = value => {
    if (value === 1) {
      this.setState(prevState => {
        const {showMentionsOptions, filterMentionBuffer} = prevState;
        return {
          showMentionsOptions: !showMentionsOptions,
          showComandOptions: false,
          filterMentionBuffer: !showMentionsOptions ? filterMentionBuffer : [],
          mentionsCount: !showMentionsOptions ? this.state.mentionsCount : 0,
        };
      });
    } else if (value === 2) {
      this.setState({
        showComandOptions: !this.state.showComandOptions,
        showMentionsOptions: false,
        // showDolarTags: false,
        filterMentionBuffer: [],
        mentionsCount: 0,
      });
    }
  };

  isComand() {
    return this.state.messageText.trim()[0] === '/';
  }

  send = () => {
    if (this.state.loading) {
      return false;
    }
    if (this.isComand()) {
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
          this.closeComands();
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
          await this.props.updatePost({
            ...post,
            message: parsedValue,
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
          const {channelId, root_id} = this.props;
          const parsedValue = Emoji.parse(messageText);
          await this.props.createPost(
            parsedValue,
            channelId,
            root_id,
            filesIds,
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
        showComandOptions: true,
      });
    } else {
      this.setState({
        showComandOptions: false,
      });
    }

    this.setState(
      {
        messageText: value,
      },
      this.checkForMentionsOrTags,
    );
  };

  filterDolarTags() {
    const nextTags = this.props.channelDolarTagNames.filter(tag => {
      const userString = `$${tag.toLowerCase()}`;
      const indexFocus = this.state.currentDolarTagTextFocused;
      const inputValue = this.state.filerDolarTagBuffer;
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
    this.closeDolarTags();
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

  filterComands() {
    const commands = this.props.commands.filter(command => {
      const stringComand = `/${command.trigger.toLowerCase()}`;
      const inputValue = this.state.messageText
        ? this.state.messageText.toLowerCase()
        : '';
      if (this.state.messageText.length > 1) {
        return stringComand.match(inputValue);
      }
      return true;
    });
    if (commands.length === 0) {
      this.closeComands();
    }
    return commands;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  getMentionsComponent() {
    return (
      <View style={styles.showOptionsView}>
        <ScrollView>
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
                    uri: getUserProfilePicture(
                      user.id,
                      user.last_picture_update,
                    ),
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
      </View>
    );
  }

  executeComands = trigger => {
    try {
      this.setState({
        messageText: trigger,
      });
      this.closeComands();
    } catch (ex) {}
  };

  closeComands() {
    this.setState({
      showComandOptions: false,
    });
  }

  getCommandComponent() {
    return (
      <View style={styles.showOptionsView}>
        <ScrollView>
          {this.filterComands().map((data, index) => (
            <TouchableHighlight
              underlayColor="#17C491"
              onPress={() => {
                this.executeComands(data.trigger);
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
      iteralbeEnd,
      messageText,
      // selection
    } = this.state;
    const nextState = `${messageText.slice(
      0,
      iterableInit,
    )}${type}${str.trim()}${messageText.slice(
      iteralbeEnd,
      messageText.length,
    )}`;
    this.setState({
      messageText: nextState,
    });
    this.closeTags();
    this.closeMentions();
    this.closeDolarTags();
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

  determineIfOpenDolarTags() {
    const {selection, messageText} = this.state;
    const patt = dolarTagRegx;
    const matches = messageText.match(dolarTagRegx);
    const startCursor = selection.start;
    let currentIndex = null;
    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iteralbeEnd = patt.lastIndex;
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
        iteralbeEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return currentIndex !== null;
  }

  checkForMentionsOrTags() {
    const {messageText, selection, showMentionsOptions, showTags} = this.state;

    if (messageText.trim() === '') {
      this.closeMentions();
      this.closeTags();
      this.closeDolarTags();
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
    let dolarTags = false;

    if (nexMentionstMatch.includes('@') || this.determineIfOpenMentions()) {
      mentions = true;
      this.setState({
        showMentionsOptions: true,
        showTags: false,
        showDolarTags: false,
        filerTagBuffer: [],
      });
    } else if (nextTagMatch.includes('#') || this.determineIfOpenTags()) {
      tags = true;
      this.setState({
        showTags: true,
        showMentionsOptions: false,
        showDolarTags: false,
        filterMentionBuffer: [],
      });
    } else if (nextTagMatch.includes('$') || this.determineIfOpenDolarTags()) {
      dolarTags = true;
      this.setState({
        showDolarTags: true,
        showTags: false,
        showMentionsOptions: false,
        filerDolarTagBuffer: [],
      });
    } else if (nextTagMatch.includes(' ')) {
      this.closeMentions();
      this.closeTags();
      this.closeDolarTags();
    }

    // find rgex and index for each posible case only mentions or #
    if (mentions) {
      const restOfMatchs = messageText.match(mentionsRegx);
      const {
        iterableInit,
        iteralbeEnd,
        currentIndex,
      } = this.calculateCurrentMentionFocus(selection, restOfMatchs);

      this.setState({
        filterMentionBuffer: restOfMatchs,
        currentMentionTextFocused: currentIndex,
        iterableInit,
        iteralbeEnd,
      });
    } else if (tags) {
      const restOfMatchs = messageText.match(tagRegx);
      const {
        iterableInit,
        iteralbeEnd,
        currentIndex,
      } = this.calculateCurrentTagFocus(selection, restOfMatchs);

      this.setState({
        filerTagBuffer: restOfMatchs,
        currentTagTextFocused: currentIndex,
        iterableInit,
        iteralbeEnd,
      });
    } else if (dolarTags) {
      const restOfMatchs = messageText.match(dolarTagRegx);
      const {
        iterableInit,
        iteralbeEnd,
        currentIndex,
      } = this.calculateCurrentDolarTagFocus(selection, restOfMatchs);
      this.setState({
        filerDolarTagBuffer: restOfMatchs,
        currentDolarTagTextFocused: currentIndex,
        iterableInit,
        iteralbeEnd,
      });
    }
  }

  calculateCurrentDolarTagFocus(selections, matches = []) {
    const patt = dolarTagRegx;
    const startCursor = selections.start;
    const {messageText} = this.state;
    let currentIndex = null;
    let iterableInit = 0;
    let iteralbeEnd = 0;

    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iteralbeEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return {
      currentIndex: currentIndex || 0,
      iteralbeEnd,
      iterableInit,
    };
  }

  calculateCurrentTagFocus(selections, matches = []) {
    const patt = tagRegx;
    const startCursor = selections.start;
    const {messageText} = this.state;
    let currentIndex = null;
    let iterableInit = 0;
    let iteralbeEnd = 0;

    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iteralbeEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return {
      currentIndex: currentIndex || 0,
      iteralbeEnd,
      iterableInit,
    };
  }

  calculateCurrentMentionFocus(selections, matches = []) {
    const patt = mentionsRegx;
    const startCursor = selections.start;
    const {messageText} = this.state;
    let currentIndex = null;
    let iterableInit = 0;
    let iteralbeEnd = 0;

    while ((match = patt.exec(messageText))) {
      if (startCursor <= patt.lastIndex && match.index <= startCursor) {
        iteralbeEnd = patt.lastIndex;
        iterableInit = match.index;
        currentIndex = matches.indexOf(match[0]);
        break;
      }
    }

    return {
      currentIndex: currentIndex || 0,
      iteralbeEnd,
      iterableInit,
    };
  }

  closeTags() {
    this.setState({
      showTags: false,
      filerTagBuffer: [],
    });
  }

  closeDolarTags() {
    this.setState({
      showDolarTags: false,
      filerDolarTagBuffer: [],
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

  getDolarTagsComponent() {
    return (
      <View style={styles.showOptionsView}>
        <ScrollView>
          {this.filterDolarTags().map((name, index) => (
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

  render() {
    const {placeholder, loggedUserPicture, isPrivateChannel} = this.props;
    const {
      messageText,
      showMentionsOptions,
      showComandOptions,
      showTags,
      uploadImages,
      uploadVideos,
      uploadDocument,
      showDolarTags,
    } = this.state;
    return (
      <View style={styles.container}>
        {showMentionsOptions &&
          !isPrivateChannel &&
          this.getMentionsComponent()}
        {showComandOptions && this.getCommandComponent()}
        {showTags && this.getTagComponent()}
        {showDolarTags && this.getDolarTagsComponent()}
        <View style={{flexDirection: 'row'}}>
          <ProfilePicture loggedUserPicture={loggedUserPicture} />
          <View
            style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 10 : null}}>
            <TextInput
              keyboardType="default"
              dataDetectorTypes="all"
              value={messageText}
              placeholder={placeholder}
              style={styles.input}
              ref={this.refInput}
              onSelectionChange={this.onSelectionChange}
              onChangeText={this.onChangeMessage}
              autoCorrect={false}
              multiline
              underlineColorAndroid="transparent"
              allowFontScaling
            />
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
            {!isPrivateChannel && (
              <TouchableHighlight
                underlayColor="rgba(63, 184, 127, 0.2)"
                onPress={() => this.showOptionsView(1)}>
                <Image source={AT} />
              </TouchableHighlight>
            )}
            <TouchableHighlight
              underlayColor="rgba(63, 184, 127, 0.2)"
              onPress={() => this.showOptionsView(2)}>
              <Image source={SLASH} />
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
              {this.isDisable() ? (
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
  commands: state.commands.map(({name, trigger}) => ({name, trigger})),
  users: state.users.keys
    .filter(key => !state.sponsored.includes(key))
    .map(key => (state.users.data[key] ? state.users.data[key] : {})),
  channelTagNames: getHashTagChannelsNames(state), // state.channelsTagNames
  channelDolarTagNames: getDolarChannelNames(state),
  loggedUserPicture: state.login.user
    ? getUserProfilePicture(
        state.login.user.id,
        state.login.user.last_picture_update,
      )
    : '',
  isPrivateChannel: getIsCurrentFocusChannelPrivate(state),
});

const mapDisptchToProps = {
  createPost,
  updatePost,
  executeCommand,
};

export default connect(
  mapStateToProps,
  mapDisptchToProps,
)(Input);
