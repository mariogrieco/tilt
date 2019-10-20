export default function mapChannelsToDictionary(channels) {
  const dictionary = {};
  channels.forEach(channel => {
    dictionary[channel.id] = channel;
  });
  return dictionary;
}
