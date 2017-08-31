import 'core-js/shim';
import 'url-polyfill';

if (StorageManager.isLocalMode()) {
  Object.assign(require('fs'), global.require('fs'));
  Object.assign(require('path'), global.require('path'));
  Object.assign(require('crypto'), global.require('crypto'));
}
