import 'core-js/shim';
import 'url-polyfill';

if (StorageManager.isLocalMode()) {
  Object.defineProperties(process, Object.getOwnPropertyDescriptors(global.process));
  Object.defineProperties(require('fs'), Object.getOwnPropertyDescriptors(global.require('fs')));
  Object.defineProperties(require('path'), Object.getOwnPropertyDescriptors(global.require('path')));
  Object.defineProperties(require('crypto'), Object.getOwnPropertyDescriptors(global.require('crypto')));
  Object.defineProperties(require('util'), Object.getOwnPropertyDescriptors(global.require('util')));
} else {
  require('util').promisify = require('es6-promisify').promisify;
}
