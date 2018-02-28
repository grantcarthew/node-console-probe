const probe = require('./console-probe')
const json = require('./console-json')
const yaml = require('./console-yaml')

module.exports = Object.freeze({
  apply,
  probe,
  json,
  yaml
})

function apply (obj) {
  if (obj == null) {
    global.console.probe = probe
    global.console.json = json
    global.console.yaml = yaml
  } else {
    obj.probe = probe
    obj.json = json
    obj.yaml = yaml
  }
}
