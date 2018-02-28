const fastSafeStringify = require('fast-safe-stringify')
const jsonColorizer = require('json-colorizer')

module.exports = function json (obj, replacer = null, spacer = 2, color = {}) {
  const asString = fastSafeStringify(obj, replacer, spacer)
  console.log(jsonColorizer(asString, color))
}
