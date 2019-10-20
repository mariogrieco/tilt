// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
// @flow

import { Files, General } from 'constants';
import { Client4 } from 'client';
import mimeDB from 'mime-db';

import type { FileInfo } from 'types/files';

export function getFormattedFileSize(file: FileInfo): string {
  const bytes = file.size;
  const fileSizes = [
    ['TB', 1024 * 1024 * 1024 * 1024],
    ['GB', 1024 * 1024 * 1024],
    ['MB', 1024 * 1024],
    ['KB', 1024],
  ];
  const size = fileSizes.find((unitAndMinBytes) => {
    const minBytes = unitAndMinBytes[1];
    return bytes > minBytes;
  });
  if (size) {
    return `${Math.floor(bytes / size[1])} ${size[0]}`;
  }
  return `${bytes} B`;
}

export function getFileType(file: FileInfo): string {
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

let extToMime;
function buildExtToMime() {
  extToMime = {};
  Object.keys(mimeDB).forEach((key) => {
    const mime = mimeDB[key];
    if (mime.extensions) {
      mime.extensions.forEach((ext) => {
        extToMime[ext] = key;
      });
    }
  });
}

export function lookupMimeType(filename: string): string {
  if (!extToMime) {
    buildExtToMime();
  }

  const ext = filename.split('.').pop().toLowerCase();

  return extToMime[ext] || 'application/octet-stream';
}

export function getFileUrl(fileId: string): string {
  return Client4.getFileRoute(fileId);
}

export function getFileDownloadUrl(fileId: string): string {
  return `${Client4.getFileRoute(fileId)}?download=1`;
}

export function getFileThumbnailUrl(fileId: string): string {
  return `${Client4.getFileRoute(fileId)}/thumbnail`;
}

export function getFilePreviewUrl(fileId: string): string {
  return `${Client4.getFileRoute(fileId)}/preview`;
}

export function sortFileInfos(fileInfos: Array<FileInfo> = [], locale: string = General.DEFAULT_LOCALE): Array<FileInfo> {
  return fileInfos.sort((a, b) => {
    if (a.create_at !== b.create_at) {
      return a.create_at - b.create_at;
    }

    return a.name.localeCompare(b.name, locale, { numeric: true });
  });
}
