const numbro = require('numbro');

const num_format = number => {
  if (!number) {
    return number;
  }
  return numbro(number).format({
    spaceSeparated: false,
    average: true,
    totalLength: number <= 99 ? 1 : number <= 9999 ? 2 : 3,
  });
};

export default num_format;
