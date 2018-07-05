const chalk = require('chalk')

module.exports = function valid (value) {
  if (value == null) {
    let message = chalk.red('[console-probe] Cannot inspect: ')
    message += Object.prototype.toString.call(value)
    console.log(message)
    return false
  }
  return true
}
