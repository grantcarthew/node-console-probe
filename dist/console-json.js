'use strict';

const fastSafeStringify = require('fast-safe-stringify');
const jsonColorizer = require('json-colorizer');
const valid = require('./valid');

module.exports = function json(obj, replacer = null, spacer = 2, color = {}) {
  if (!valid(obj)) {
    return;
  }
  const asString = fastSafeStringify(obj, replacer, spacer);
  console.log(jsonColorizer(asString, color));
};