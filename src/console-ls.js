const jsome = require('jsome')
const valid = require('./valid')
// jsome.level.show = true

module.exports = function ls (obj) {
  if (!valid(obj)) { return }
  jsome(obj)
}
