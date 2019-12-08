const parser = str =>
  str
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace('$', '')
    .replace('#', '')
    .replace('@', '');

export default parser;
