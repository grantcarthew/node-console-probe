const probe = require('./console-probe')
const json = require('./console-json')
const yaml = require('./console-yaml')
const ls = require('./console-ls')

module.exports = Object.freeze({
  apply,
  probe,
  json,
  yaml,
  ls
})

function apply (obj) {
  if (obj == null) {
    global.console.probe = probe
    global.console.json = json
    global.console.yaml = yaml
    global.console.ls = ls
  } else {
    obj.probe = probe
    obj.json = json
    obj.yaml = yaml
    obj.ls = ls
  }
}

// Adding BigInt support for JSON.stringify()
if (global.BigInt) {
  global.BigInt.prototype.toJSON = function (key) {
    return this.toString()
  }
}
