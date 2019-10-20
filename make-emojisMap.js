const fs = require('fs-extra');

const ROO_DIR = `${__dirname}/tilt-emojis`.replace(/\\/g, '/');
const emojis_android = require('./tilt-emojis/emojis_map.android.json');
const emojis_ios = require('./tilt-emojis/emojis_map.ios.json');


let androidRequires = 'export const store = {';
let iosRequires = 'export const store = {';

// const replace1 = new RegExp('-', 'g');

const initStr = 'export default new Map([';
const endStr = ']);'

let androidStr = initStr;
let androidFilenamesMap = initStr;

emojis_android.data.forEach(emoji => {
  let unicodes = emoji.unicodes;
  let name = emoji.filename.replace('.png', '');
  let index = emoji.index;

  androidStr += `["${unicodes.join('-')}", ${index}],`
  androidFilenamesMap += `[":${name}:", ${index}],`

  androidRequires += `
    ":${name}:": require("${ROO_DIR}/assets/android/${name}.png"),`
});
androidRequires += `
}
`;
androidFilenamesMap += endStr;
androidStr += endStr;

let iosStr = initStr;
let iosFilenamesMap = initStr;
emojis_ios.data.forEach(emoji => {
  let unicodes = emoji.unicodes;
  let name = emoji.filename.replace('.png', '');
  let index = emoji.index;

  iosStr += `["${unicodes.join('-')}", ${index}],`
  iosFilenamesMap += `[":${name}:", ${index}],`

  iosRequires += `
  ":${name}:": require("${ROO_DIR}/assets/ios/${name}.png"),
`
});
iosRequires += `
}
`;
iosStr += endStr;
iosFilenamesMap += endStr;



fs.writeFile(`${ROO_DIR}/requires.android.js`, androidRequires, function (err) {
  if (err) {
    console.log(err);
  }
  console.log('done android!');
});


fs.writeFile(`${ROO_DIR}/requires.ios.js`, iosRequires, function (err) {
  if (err) {
    console.log(err);
  }
  console.log('done ios!');
});


fs.writeFile(`${ROO_DIR}/emojiIndicesByUnicode.android.js`, androidStr, function (err) {
  if (err) {
    console.log(err);
  }
  console.log('done android!');
});

fs.writeFile(`${ROO_DIR}/emojiIndicesByFilename.android.js`, androidFilenamesMap, function (err) {
  if (err) {
    console.log(err);
  }
  console.log('done android!');
});

fs.writeFile(`${ROO_DIR}/emojiIndicesByFilename.ios.js`, iosFilenamesMap, function (err) {
  if (err) {
    console.log(err);
  }
  console.log('done ios !');
});


fs.writeFile(`${ROO_DIR}/emojiIndicesByUnicode.ios.js`, iosStr, function (err) {
  if (err) {
    console.log(err);
  }
  console.log('done ios!');
});