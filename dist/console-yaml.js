'use strict';

const prettyJson = require('prettyjson');
const valid = require('./valid');

module.exports = function yaml(obj, options, indentation) {
  if (!valid(obj)) {
    return;
  }
  console.log(prettyJson.render(obj, options, indentation));
};