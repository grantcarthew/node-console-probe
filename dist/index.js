'use strict';

var probe = require('./console-probe');
var json = require('./console-json');
var yaml = require('./console-yaml');

module.exports = Object.freeze({
  apply,
  probe,
  json,
  yaml
});

function apply(obj) {
  if (obj == null) {
    global.console.probe = probe;
    global.console.json = json;
    global.console.yaml = yaml;
  } else {
    obj.probe = probe;
    obj.json = json;
    obj.yaml = yaml;
  }
}