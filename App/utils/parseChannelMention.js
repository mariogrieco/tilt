import parser from '../utils/parse_display_name';

const parseChannelMention = (str = '') => parser(str);

export default parseChannelMention;
