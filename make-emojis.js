const fs = require('fs-extra');
const rp = require('request-promise');
const $ = require('cheerio');
const download = require('image-downloader')

const ROO_DIR = `./tilt-emojis`;
const ANDROID_NAME_FILE = `emojis_map.android`;
const IOS_NAME_FILE = `emojis_map.ios`
const IMAGE_ANDROID_PATH = `${ROO_DIR}/assets/android`;
const IMAGE_IOS_PATH = `${ROO_DIR}/assets/ios`;

const mainGridClass = 'emoji-grid';
const mainAndroidUrl = 'https://emojipedia.org/samsung/one-ui-1.5/' // 'https://emojipedia.org/google/android-10.0/';
const mainIosUrl = 'https://emojipedia.org/apple/ios-13.1/';

function parseUrl(url, title, index) {
  url = url.replace('.png', '');
  const name = url.split('/').pop().split('_');
  const unicodes = url.split('/').pop().split('_');
  return {
    name: name[0],
    unicodes: unicodes[unicodes.length - 2 > 0 ? unicodes.length - 2 : 1].split('-'),
    url,
    title,
    index,
    shortcodes: [],  // https://emojipedia.org/filename and class .shortcodes > li :names_here: 
    filename: name.length > 2 ? `${name[0]}-${name[1]}` : `${name[0]}`,
    uri: `${url}.png`
  }
}

if (fs.existsSync(ROO_DIR)) {
  fs.removeSync(ROO_DIR);
}

fs.mkdirSync(ROO_DIR);
fs.mkdirSync(`${ROO_DIR}/assets`);
fs.mkdirSync(IMAGE_ANDROID_PATH);
fs.mkdirSync(IMAGE_IOS_PATH);


function extractUrl($element) {
  if ($element.attribs['data-src']) return $element.attribs['data-src'];
  if ($element.attribs['data-cfsrc']) return $element.attribs['data-cfsrc'];
  if ($element.attribs['srcset']) return $element.attribs['srcset'].split(' ')[0];
}


function getFilesFor(url, callback) {
  rp(url)
    .then($html => {
      try {
        let files = [];
        const input = $(`.${mainGridClass} > li a img`, $html);

        for (let index = 0; index < input.length; index++) {
          const $element = input[index];
          const url = extractUrl($element);
          if (!url) {
            throw new Error(`missing url at index: ${index}`);
          }
          const data = parseUrl(url, $element.attribs.title, index);
          files.push(data);
        }
        callback(null, files);
      } catch (err) {
        callback(err);
      }

    })
    .catch(err => {
      callback(err);
    });
}

function saveData (nameFile, files, callback) {
  fs.writeFile(`${ROO_DIR}/${nameFile}.json`, `
    {
      "data": ${JSON.stringify(files)}
    }
  `, function (err) {
    if (err) {
      callback(err);
    }
    callback(null, 'DONE!');
  });
}


function downloadImage(url, path, callback) {
  var fs = require('fs'),
    request = require('request');

  request({ uri: url })
    .pipe(fs.createWriteStream(path))
    .on('close', function (err) {
      callback(err);
    })
}

console.log('GENERATING ANDROID FILES!!!');
getFilesFor(mainAndroidUrl, (err, files) => {
  if (err) {
    return console.log(err)
  };
  saveData(ANDROID_NAME_FILE, files, async (err) => {
    if (err) { return console.log(err) };
    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        await downloadIMG({
          url: files[index].uri,
          dest: `${IMAGE_ANDROID_PATH}/${files[index].filename}.png`,
          extractFilename: false
        });
        console.log(`ANDROID: ${index+1}/${files.length} \n`);
      }
    } catch (er) {
      console.log(err);
    }
  });
});

async function downloadIMG(options) {
  try {
    const {
      filename
    } = await download.image(options)
    console.log(filename);
  } catch (e) {
    console.error(e);
  }
}

console.log('GENERATING IOS FILES!!!');
getFilesFor(mainIosUrl, (err, files) => {
  if (err) {
    return console.log(err)
  };
  saveData(IOS_NAME_FILE, files, async (err) => {
    if (err) { return console.log(err) };
    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        await downloadIMG({
          url: files[index].uri,
          dest: `${IMAGE_IOS_PATH}/${files[index].filename}.png`,
          extractFilename: false
        });
        console.log(`IOS: ${index+1}/${files.length} \n`);
      }
    } catch (er) {
      console.log(err);
    }
  });
});
