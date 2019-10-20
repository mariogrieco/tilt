import {
  Platform
} from 'react-native';
import {
  lookup
} from 'react-native-mime-types';

// const DEFAULT_SERVER_MAX_FILE_SIZE = 50 * 1024 * 1024;// 50 Mb

export const Files = {
  AUDIO_TYPES: ['mp3', 'wav', 'wma', 'm4a', 'flac', 'aac', 'ogg'],
  CODE_TYPES: ['as', 'applescript', 'osascript', 'scpt', 'bash', 'sh', 'zsh', 'clj', 'boot', 'cl2', 'cljc', 'cljs', 'cljs.hl', 'cljscm', 'cljx', 'hic', 'coffee', '_coffee', 'cake', 'cjsx', 'cson', 'iced', 'cpp', 'c', 'cc', 'h', 'c++', 'h++', 'hpp', 'cs', 'csharp', 'css', 'd', 'di', 'dart', 'delphi', 'dpr', 'dfm', 'pas', 'pascal', 'freepascal', 'lazarus', 'lpr', 'lfm', 'diff', 'django', 'jinja', 'dockerfile', 'docker', 'erl', 'f90', 'f95', 'fsharp', 'fs', 'gcode', 'nc', 'go', 'groovy', 'handlebars', 'hbs', 'html.hbs', 'html.handlebars', 'hs', 'hx', 'java', 'jsp', 'js', 'jsx', 'json', 'jl', 'kt', 'ktm', 'kts', 'less', 'lisp', 'lua', 'mk', 'mak', 'md', 'mkdown', 'mkd', 'matlab', 'm', 'mm', 'objc', 'obj-c', 'ml', 'perl', 'pl', 'php', 'php3', 'php4', 'php5', 'php6', 'ps', 'ps1', 'pp', 'py', 'gyp', 'r', 'ruby', 'rb', 'gemspec', 'podspec', 'thor', 'irb', 'rs', 'scala', 'scm', 'sld', 'scss', 'st', 'sql', 'swift', 'tex', 'txt', 'vbnet', 'vb', 'bas', 'vbs', 'v', 'veo', 'xml', 'html', 'xhtml', 'rss', 'atom', 'xsl', 'plist', 'yaml'],
  IMAGE_TYPES: ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'tiff', 'tif'],
  PATCH_TYPES: ['patch'],
  PDF_TYPES: ['pdf'],
  PRESENTATION_TYPES: ['ppt', 'pptx'],
  SPREADSHEET_TYPES: ['xls', 'xlsx', 'csv'],
  VIDEO_TYPES: ['mp4', 'avi', 'webm', 'mkv', 'wmv', 'mpg', 'mov', 'flv'],
  WORD_TYPES: ['doc', 'docx'],
};

export const SUPPORTED_DOCS_FORMAT = [
  'application/json',
  'application/msword',
  'application/pdf',
  'application/rtf',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/x-x509-ca-cert',
  'application/xml',
  'text/csv',
  'text/plain',
];

const SUPPORTED_VIDEO_FORMAT = Platform.select({
  ios: ['video/mp4', 'video/x-m4v', 'video/quicktime'],
  android: ['video/3gpp', 'video/x-matroska', 'video/mp4', 'video/webm'],
});

export function generateId() {
  // Implementation taken from mattermost-mobile
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  id = id.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);

    let v;
    if (c === 'x') {
      v = r;
    } else {
      v = (r & 0x3) | 0x8;
    }

    return v.toString(16);
  });

  return `uid${id}`;
  // return id;
}

export const encodeHeaderURIStringToUTF8 = string => `${encodeURIComponent(string)}"; filename*="utf-8''${encodeURIComponent(string)}`;


export function lookupMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return lookup(ext) || 'application/octet-stream';
}

export function buildFileUploadData(file) {
  const re = /heic/i;
  const { uri } = file;
  let name = file.fileName || file.name || file.path;
  let mimeType = lookupMimeType(name);
  let extension = name.split('.').pop().replace('.', '');

  if (re.test(extension)) {
    extension = 'JPG';
    name = name.replace(re, 'jpg');
    mimeType = 'image/jpeg';
  }

  return {
    uri,
    path: name,
    name,
    fileName: name.split('/').pop(),
    type: mimeType,
    extension
  };
}

export const isImage = (file) => {
  if (file.has_preview_image || file.mime_type === 'image/gif'
        || (file.localPath && file.type && file.type.includes('image'))) {
    return true;
  }

  return false;
};

export const isVideo = (file) => {
  let mime = file.mime_type || file.type || '';
  if (mime && mime.includes(';')) {
    mime = mime.split(';')[0];
  }

  return SUPPORTED_VIDEO_FORMAT.includes(mime);
};

export const isGif = (file) => {
  let mime = file.mime_type || file.type || '';
  if (mime && mime.includes(';')) {
    mime = mime.split(';')[0];
  }

  return mime === 'image/gif';
};

export const isDocument = (file) => {
  let mime = file.mime_type || file.type || '';
  if (mime && mime.includes(';')) {
    mime = mime.split(';')[0];
  }

  return SUPPORTED_DOCS_FORMAT.includes(mime);
};

export function getFileType(file) {
  if (!file || !file.extension) {
    return 'other';
  }

  const fileExt = file.extension.toLowerCase();
  const fileTypes = [
    'image',
    'code',
    'pdf',
    'video',
    'audio',
    'spreadsheet',
    'word',
    'presentation',
    'patch',
  ];
  return fileTypes.find((fileType) => {
    const constForFileTypeExtList = `${fileType}_types`.toUpperCase();
    const fileTypeExts = Files[constForFileTypeExtList];
    return fileTypeExts.indexOf(fileExt) > -1;
  }) || 'other';
}
