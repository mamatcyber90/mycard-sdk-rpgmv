import 'core-js/shim';
import 'url-polyfill';

if (StorageManager.isLocalMode()) {
  Object.assign(process, global.process);
  Object.assign(require('fs'), global.require('fs'));
  Object.assign(require('path'), global.require('path'));
  Object.assign(require('crypto'), global.require('crypto'));
  Object.assign(require('util'), global.require('util'));
} else {
  require('util').promisify = require('es6-promisify').promisify;
}
