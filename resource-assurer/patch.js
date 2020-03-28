const fs = require('fs');

// https://gist.github.com/niespodd/1fa82da6f8c901d1c33d2fcbb762947d
const angularDevkitFile = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';
fs.readFile(angularDevkitFile, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true, fs: \'empty\', net: \'empty\'}');

  fs.writeFile(angularDevkitFile, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

/**
 * Temporary fix for
 * ERROR in ./node_modules/cipher-base/index.js
 * Module not found: Error: Can't resolve 'stream' in '\node_modules\cipher-base'
 * @external https://github.com/DevExpress/devextreme-angular/issues/776
 */
const cipherBase = 'node_modules/cipher-base/index.js';
fs.readFile(cipherBase, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/require\('stream'\)/g, 'require(\'readable-stream\')');

  fs.writeFile(cipherBase, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

/**
 * Temporary fix for
 * ERROR in ./node_modules/hash-base/index.js
 * Module not found: Error: Can't resolve 'stream' in '\node_modules\hash-base'
 * @external https://github.com/DevExpress/devextreme-angular/issues/776
 */
const hashBase = 'node_modules/hash-base/index.js';
fs.readFile(hashBase, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/require\('stream'\)/g, 'require(\'readable-stream\')');

  fs.writeFile(hashBase, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});