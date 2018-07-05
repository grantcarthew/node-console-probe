'use strict';

const chalk = require('chalk');

module.exports = function valid(value) {
  if (value == null) {
    let message = chalk.red('[console-probe] Cannot probe: ');
    message += Object.prototype.toString.call(value);
    console.log(message);
    return false;
  }
  return true;
};