import 'core-js/shim';
import * as crypto from 'crypto';
import * as promisify from 'es6-promisify';
import * as fs from 'fs';
import * as path from 'path';
import 'proxy-polyfill';
import 'url-polyfill';
import * as util from 'util';

if (StorageManager.isLocalMode()) {
  Object.defineProperties(process, Object.getOwnPropertyDescriptors(global.process));
  Object.defineProperties(fs, Object.getOwnPropertyDescriptors(global.require('fs')));
  Object.defineProperties(path, Object.getOwnPropertyDescriptors(global.require('path')));
  Object.defineProperties(crypto, Object.getOwnPropertyDescriptors(global.require('crypto')));
  Object.defineProperties(util, Object.getOwnPropertyDescriptors(global.require('util')));
}

// old nw.js node version doesn't have
if (!util.promisify) {
  (util as any).promisify = promisify;
}
