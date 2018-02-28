const prettyJson = require('prettyjson')

module.exports = function yaml (obj, options, indentation) {
  console.log(prettyJson.render(obj, options, indentation))
}
