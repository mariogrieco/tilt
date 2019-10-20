import React, { Component } from 'react';
import {
  View,
  Linking,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import isEqual from 'lodash/isEqual';
import memoize from 'lodash/memoize';
import ParsedText from 'react-native-parsed-text';
import { connect } from 'react-redux';
import Client4 from '../../api/MattermostClient';
import InlineImage from '../InlineImage';
import {
  clearjumpToAction
} from '../../actions/advancedSearch';
import {
  Emojis
} from '../../utils/emojis';
import getIsCurrentFocusChannelPrivate from '../../selectors/getIsCurrentFocusChannelPrivate';
import CodePost from '../CodePost';
import { getHashTagChannelsNames, getDolarChannelNames } from '../../selectors/getChannelNames';
import {
  getUsersNames
} from '../../selectors/getUsersNames';

import {
  Emoji,
  RootEmojiFolder
} from '../../utils/TiltEmoji';

import {
  store
} from '../../../tilt-emojis/requires';

import styles from './style';

// const boldPattern = /\*\*([^*][\w\W][^*]*)\*\*/gm;
// const italicPattern = /(\s_|^_)(?=\S)([\s\S]*?\S)_(?![_\S])/gm;
// const strikethroughPattern = /(\s-|^-)(?=\S)([\s\S]*?\S)-(?![-\S])/gm;

// const RE_EMOTICON = {
//   slightly_smiling_face: /(^|\s)(:-?\))(?=$|\s)/g, // :)
//   wink: /(^|\s)(;-?\))(?=$|\s)/g, // ;)
//   open_mouth: /(^|\s)(:o)(?=$|\s)/gi, // :o
//   scream: /(^|\s)(:-o)(?=$|\s)/gi, // :-o
//   smirk: /(^|\s)(:-?])(?=$|\s)/g, // :]
//   smile: /(^|\s)(:-?d)(?=$|\s)/gi, // :D
//   stuck_out_tongue_closed_eyes: /(^|\s)(x-d)(?=$|\s)/gi, // x-d
//   stuck_out_tongue: /(^|\s)(:-?p)(?=$|\s)/gi, // :p
//   rage: /(^|\s)(:-?[[@])(?=$|\s)/g, // :@
//   slightly_frowning_face: /(^|\s)(:-?\()(?=$|\s)/g, // :(
//   cry: /(^|\s)(:[`'’]-?\(|:&#x27;\(|:&#39;\()(?=$|\s)/g, // :`(
//   confused: /(^|\s)(:-?\/)(?=$|\s)/g, // :/
//   confounded: /(^|\s)(:-?s)(?=$|\s)/gi, // :s
//   neutral_face: /(^|\s)(:-?\|)(?=$|\s)/g, // :|
//   flushed: /(^|\s)(:-?\$)(?=$|\s)/g, // :$
//   mask: /(^|\s)(:-x)(?=$|\s)/gi, // :-x
//   heart: /(^|\s)(<3|&lt;3)(?=$|\s)/g, // <3
//   broken_heart: /(^|\s)(<\/3|&lt;&#x2F;3)(?=$|\s)/g, // </3
//   thumbsup: /(^|\s)(:\+1:)(?=$|\s)/g, // :+1:
//   thumbsdown: /(^|\s)(:-1:)(?=$|\s)/g, // :-1:
// };


export class PureParsedText extends Component {
  constructor(props) {
    super(props);


    this.createPatters = memoize((disableUserPattern) => {
      if (disableUserPattern) {
        return [
          {
            pattern: this.getChannelDolarPattern(),
            style: styles.channelPatter,
            onPress: this.onChannelPress.bind(this),
            renderText: this.renderTextD
          },
          {
            pattern: this.getChannelTagPatter(),
            style: styles.channelPatter,
            onPress: this.onChannelPress.bind(this),
            renderText: this.renderTextH
          },
          {
            type: 'url',
            style: styles.url,
            onPress: this.handleUrlPress.bind(this)
          },
          {
            pattern: this.getUrldotComPatter(),
            style: styles.url,
            onPress: this.handleConvertedUrlPress.bind(this)
          },
          {
            pattern: this.getEmojiPatter(),
            style: {},
            renderText: this.renderEmoji.bind(this)
          },
          {
            pattern: this.getCodePattern(),
            style: {},
            renderText: this.renderCode.bind(this)
          },
          {
            pattern: this.getEmailPattern(),
            style: {},
            renderText: this.renderEmailText.bind(this),
            onPress: this.handleEmailPress.bind(this)
          },
        ];
      }
      return [
        {
          pattern: this.getChannelDolarPattern(),
          style: styles.channelPatter,
          onPress: this.onChannelPress.bind(this),
          renderText: this.renderTextD
        },
        {
          pattern: this.getMentionPatter(),
          style: styles.mentions,
          onPress: this.onUserPress.bind(this)
        },
        {
          pattern: this.getChannelTagPatter(),
          style: styles.channelPatter,
          onPress: this.onChannelPress.bind(this),
          renderText: this.renderTextH
        },
        {
          type: 'url',
          style: styles.url,
          onPress: this.handleUrlPress.bind(this)
        },
        {
          pattern: this.getUrldotComPatter(),
          style: styles.url,
          onPress: this.handleConvertedUrlPress.bind(this)
        },
        {
          pattern: this.getEmojiPatter(),
          style: {},
          renderText: this.renderEmoji.bind(this)
        },
        {
          pattern: this.getCodePattern(),
          style: {},
          renderText: this.renderCode.bind(this)
        },
        {
          pattern: this.getBullishPattern(),
          style: {},
          renderText: this.renderBullish.bind(this)
        },
        {
          pattern: this.getBearishPattern(),
          style: {},
          renderText: this.renderBearish.bind(this)
        },
        {
          pattern: this.getBoldPattern(),
          style: {},
          renderText: this.renderBoldText.bind(this)
        },
        {
          pattern: this.getItalicPattern(),
          style: {},
          renderText: this.renderItalicText.bind(this)
        },
        {
          pattern: this.getStrikePattern(),
          style: {},
          renderText: this.renderStrikeText.bind(this)
        },
        {
          pattern: this.getShrugPattern(),
          style: {},
          renderText: this.renderShrug.bind(this)
        },
        {
          pattern: this.getEmailPattern(),
          style: {},
          renderText: this.renderEmailText.bind(this),
          onPress: this.handleEmailPress.bind(this)
        },
        {
          pattern: this.getQuotePattern(),
          style: {},
          renderText: this.renderQuote.bind(this)
        },
        {
          pattern: this.getYOLOPattern(),
          style: {},
          renderText: this.renderYOLO.bind(this)
        },
        {
          pattern: this.getLossPattern(),
          style: {},
          renderText: this.renderLoss.bind(this)
        },
        {
          pattern: this.getGainPattern(),
          style: {},
          renderText: this.renderGain.bind(this)
        },
        {
          pattern: this.getShitpostPattern(),
          style: {},
          renderText: this.renderShitpost.bind(this)
        },
        {
          pattern: this.getStocksPattern(),
          style: {},
          renderText: this.renderStocks.bind(this)
        },
        {
          pattern: this.getOptionsPattern(),
          style: {},
          renderText: this.renderOptions.bind(this)
        },
        {
          pattern: this.getCryptosPattern(),
          style: {},
          renderText: this.renderCryptos.bind(this)
        },
        {
          pattern: this.getDiscussionPattern(),
          style: {},
          renderText: this.renderDiscussion.bind(this)
        },
        {
          pattern: this.getFuturesPattern(),
          style: {},
          renderText: this.renderFutures.bind(this)
        },
        {
          pattern: this.getSatirePattern(),
          style: {},
          renderText: this.renderSatire.bind(this)
        }
      ];
    });

    this.state = {
      parser: this.createPatters(props.disableUserMention)
    };
  }

  renderCode(text) {
    return <CodePost str={text} />;
  }

  getCodePattern() {
    return /`(.*?)`/;
  }

  getEmojiLink(text) {
    const systemEmoji = Emojis.find(emo => `:${emo.aliases[0]}:`.match(text));
    if (!systemEmoji) return null;
    if (systemEmoji.id) {
      return `${Client4.getEmojiRoute(systemEmoji.id)}/image`;
    }
    const filename = systemEmoji.filename || systemEmoji.aliases[0];
    if (!filename) return null;
    return Client4.getSystemEmojiImageUrl(filename);
  }

  renderEmoji(text) {
    const emoji  = Emoji.getEmojiUnicode(text);
    if (!emoji) return <Text>{text}</Text>;
    const unicds = emoji.unicodes.slice(0, 2).map(u => parseInt(u, 16))
    // const u0 = parseInt(emoji.unicodes[0], 16);
    // const u1 = parseInt(emoji.unicodes[1], 16);
    // const u2 = parseInt(emoji.unicodes[2], 16);
    return <Text>{String.fromCodePoint(...unicds)}</Text>
    // try{
    // } catch (er) {
    //   return <Text>{text}</Text>
    // }
  }

  getEmojiPatter() {
    return /:([A-Za-z0-9_-]+):/;
  }

  async handleUrlPress(text) {
    if (text.includes('www.') && (!text.includes('http'))) {
      const httpToUrl = `https://${text}`;
      try {
        await Linking.openURL(httpToUrl);
      } catch (err) {
        alert(err);
      }
    } else {
      try {
        await Linking.openURL(text);
      } catch (err) {
        alert(err);
      }
    }
  }

  async handleConvertedUrlPress(text) {
    if (text.includes('@')) {
      const emailUrl = `mailto:${text}`;
      try {
        await Linking.openURL(emailUrl);
      } catch (err) {
        alert(err);
      }
    } else {
      const httpToUrl = `https://${text}`;
      try {
        await Linking.openURL(httpToUrl);
      } catch (err) {
        alert(err);
      }
    }
  }

  async handleEmailPress(text) {
    const emailUrl = `mailto:${text}`;
    try {
      await Linking.openURL(emailUrl);
    } catch (err) {
      alert(err);
    }
  }

  renderTextD(text) {
    return `$${text.replace('$', '')}`;
  }

  renderTextH(text) {
    return `#${text.replace('#', '')}`;
  }

  onChannelPress(value) {
    this.props.clearjumpToAction();
    this.props.onChannel(value);
  }

  onUserPress(value) {
    this.props.onUser(value);
  }

  getUrldotComPatter() {
    return /\S+\.com/;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state));
  }

  getChannelTagPatter() {
    const {
      channelsNames
    } = this.props;
    return new RegExp(`#(${(channelsNames || []).join('|')})\\b`);
  }

  getChannelDolarPattern () {
    const {
      channelDolarNames
    } = this.props;
    return new RegExp(`\\$(${(channelDolarNames || []).join('|')})\\b`);
  }

  getMentionPatter() {
    const {
      usernames
    } = this.props;
    return new RegExp(`@(${(usernames || []).join('|')})\\b`);
  }

  getBullishPattern() {
    return /-(Bullish)+-/gi;
  }

  renderBullish(text) {
    return (
      <Text style={styles.bullishText}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getBearishPattern() {
    return /-(Bearish)+-/gi;
  }

  renderBearish(text) {
    return (
      <Text style={styles.bearishText}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getBoldPattern() {
    return /\*(.*?)\*/;
  }

  renderBoldText(text) {
    return (
      <Text style={styles.boldText}>
        {text.replace(/\*/g, '')}
      </Text>
    );
  }

  getStrikePattern() {
    return /~(.*?)~/;
  }

  renderStrikeText(text) {
    return (
      <Text style={{ textDecorationLine: 'line-through' }}>{text.replace(/~/g, '')}</Text>
    );
  }

  getItalicPattern() {
    return /_(.*?)_/;
  }

  renderItalicText(text) {
    return (
      <Text style={styles.italicText}>{text.replace(/_/g, '')}</Text>
    );
  }

  getShrugPattern() {
    return /(Shrug)+/gi;
  }

  renderShrug(text) {
    return text.replace(this.getShrugPattern(), '¯\\_(ツ)_/¯');
  }

  getYOLOPattern() {
    return /-(Yolo)+-/gi;
  }

  renderYOLO(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(252, 199, 59, 0.7)' }}>{text.toUpperCase().replace(/-/g, ' ')}</Text>
    );
  }

  getLossPattern() {
    return /-(Loss)+-/gi;
  }

  renderLoss(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(252, 62, 48, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getGainPattern() {
    return /-(Gain)+-/gi;
  }

  renderGain(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(23, 196, 145, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getShitpostPattern() {
    return /-(Shitpost)+-/gi;
  }

  renderShitpost(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(139, 87, 42, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getStocksPattern() {
    return /-(Stocks)+-/gi;
  }

  renderStocks(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(16, 115, 240, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getOptionsPattern() {
    return /-(Options)+-/gi;
  }

  renderOptions(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(109, 98, 229, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getCryptosPattern() {
    return /-(Cryptos)+-/gi;
  }

  renderCryptos(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(255, 74, 0, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getDiscussionPattern() {
    return /-(Discussion)+-/gi;
  }

  renderDiscussion(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(39, 156, 211, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getFuturesPattern() {
    return /-(Futures)+-/gi;
  }

  renderFutures(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(255, 96, 126, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getSatirePattern() {
    return /-(Satire)+-/gi;
  }

  renderSatire(text) {
    return (
      <Text style={{ fontFamily: 'SFProDisplay-Medium', backgroundColor: 'rgba(142, 142, 147, 0.7)', textTransform: 'capitalize' }}>{text.replace(/-/g, ' ')}</Text>
    );
  }

  getQuotePattern() {
    return /"(.*?)"/;
  }

  renderQuote(text) {
    return (
      <Text style={[styles.italicText]}>{text}</Text>
    );
  }

  getEmailPattern() {
    return /\S+@\S+.\S+/;
  }

  renderEmailText(text) {
    return (
      <Text style={styles.emailText}>{text}</Text>
    );
  }

  messageIsCode(message = '') {
    if (message.length >= 4 && message.slice(0, 4).includes('    ')) {
      return true;
    }

    if (message.length > 1) {
      let toCompare = message.trim() || '';
      toCompare = toCompare.split('\n');
      if (toCompare.length < 3) {
        return false;
      }
      return toCompare[0].match(/^`{3,}/) && toCompare[toCompare.length - 1].match(/`{3,}$/);
      // return message.match(/`{3,}$/gmu) && message.match(/^`{3,}/);
    }

    return false;
  }

  render() {
    const {
      typeIsSystem,
    } = this.props;
    let {
      message
    } = this.props;
    const {
      parser
    } = this.state;
    const containerStyle = this.messageIsCode(message) ? {
      width: '100%',
      borderRadius: 4,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginTop: 10,
      backgroundColor: '#F4F4F4',
      borderColor: '#DCDCDC',
      borderWidth: StyleSheet.hairlineWidth,
    } : null;

    if (containerStyle) {
      if (message.slice(0, 4) === '    ') {
        message = message.slice(4, message.length);
      }
      return (
        <View style={containerStyle}>
          <Text style={styles.codeText}>
            {message.replace(/`{3,}$/gmu, '').replace(/^`{3,}/, '')}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <ParsedText
          childrenProps={{ allowFontScaling: false }}
          style={[styles.text, typeIsSystem ? styles.systemText : {}]}
          parse={parser}
        >
          {`${message}`}
        </ParsedText>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const hasChannelFocus = state.appNavigation.active_channel_id;
  if (hasChannelFocus) {
    return ({
      disableUserMention: getIsCurrentFocusChannelPrivate(state),
      channelsNames: getHashTagChannelsNames(state),
      usernames: getUsersNames(state),
      channelDolarNames: getDolarChannelNames(state)
    });
  }
  return ({
    disableUserMention: false,
    channelDolarNames: getDolarChannelNames(state),
    channelsNames: getHashTagChannelsNames(state),
    usernames: getUsersNames(state)
  });
};

const mapDispatchToProps = {
  clearjumpToAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PureParsedText);