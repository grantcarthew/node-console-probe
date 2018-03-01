'use strict';

var fastSafeStringify = require('fast-safe-stringify');
var jsonColorizer = require('json-colorizer');

module.exports = function json(obj) {
  var replacer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var spacer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var asString = fastSafeStringify(obj, replacer, spacer);
  console.log(jsonColorizer(asString, color));
};