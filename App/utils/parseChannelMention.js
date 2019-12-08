import parser from '../utils/parse_display_name';

const parseChannelMention = (str = '') => parser(str);

export const evaluateChannelForMention = channel => {
  if (channel.name === 'welcome') {
    return '#welcome';
  }
  const name = `${channel.content_type !== 'N' ? '$' : '#'}${channel.name}`;
  return name;
};

export default parseChannelMention;
