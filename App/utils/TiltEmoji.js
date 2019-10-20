// import {
//   Emojis,
//   EmojiIndicesByUnicode
// } from './emojis';
import {
  Platform
} from 'react-native';
import EmojisFileNameMap from '../../tilt-emojis/emojiIndicesByFilename';
import EmojisMap from '../../tilt-emojis/emojiIndicesByUnicode';
import StoreAndroid from '../../tilt-emojis/emojis_map.android.json';
import StoreIos from '../../tilt-emojis/emojis_map.ios.json';

const emojiRegex = require('emoji-regex');

const mainStore = Platform.select({
  ios: StoreIos,
  android: StoreAndroid
});

// import iosMap from '../../tilt-emojis/emojiIndicesByUnicode.ios';
// import iosStore from '../../tilt-emojis/emojis_map.ios.json';

export const RootEmojiFolder = '../../../tilt-emojis/assets/android';

export class Emoji {
  static getEmojiRegx() {
    return new RegExp('(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])');
  }

  static convertUnicode(input) {
    return input.replace(/\\u(\w\w\w\w)/g,function(a,b) {
      var charcode = parseInt(b,16);
      return String.fromCharCode(charcode);
    });
  }

  static unicode2 (str) {
    return Array.from(str).map(s => s.codePointAt(0).toString(16) ).join('-')
  }

  static toUnicode(emoji) {
    let comp;
    if (emoji.length === 1) {
      comp = emoji.charCodeAt(0);
    }

    comp = (
      (emoji.charCodeAt(0) - 0xD800) * 0x400
      + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );

    if (comp < 0) {
      comp = emoji.charCodeAt(0);
    }

    return comp.toString('16');
  }

  static getEmojiUnicode (name) {
    const index = EmojisFileNameMap.get(name);;
    return mainStore.data[index];
  }

  static getEmojiData(emoji) {
    let unicode = this.convertUnicode(emoji);

    if (!EmojisMap.get(unicode)) {
      unicode = this.unicode2(emoji);
    }

    if (!EmojisMap.get(unicode)) {
      unicode = this.toUnicode(emoji);
    }

    const data = mainStore.data[EmojisMap.get(unicode)];
    return data ? data : null;
  }

  static parse(str) {
    return str.replace(emojiRegex(), (emoji) => {
      const fromStore = this.getEmojiData(emoji);
      if (fromStore) {
        return `:${fromStore.filename}: `;
      }
      return 'undefined'
    })
  }
}
