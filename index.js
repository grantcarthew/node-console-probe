'use strict';

var stringify = require('fast-safe-stringify');
var archy = require('archy');
var chalk = require('chalk');
var stripAnsi = require('strip-ansi');
var types = Object.freeze({
  arr: 'arr',
  boo: 'boo',
  fun: 'fun',
  num: 'num',
  obj: 'obj',
  str: 'str',
  unk: '---'
});

module.exports = Object.freeze({
  apply,
  probe,
  json
});

function apply(obj) {
  if (obj == null) {
    global.console.probe = probe;
    global.console.json = json;
  } else {
    obj.probe = probe;
    obj.json = json;
  }
}

function probe(obj) {
  if (obj == null) {
    console.log(obj);
    return;
  }

  var tree = null;
  var currentNode = newNode('root');

  for (; obj != null; obj = Object.getPrototypeOf(obj)) {
    var node = newNode(genHeader(obj));
    node.nodes = Object.getOwnPropertyNames(obj);

    for (var i = 0; i < node.nodes.length; i++) {
      var focusObj = null;
      try {
        focusObj = obj[node.nodes[i]];
      } catch (err) {}
      var type = genType(focusObj);
      var prefix = applyChalk(type, `[${type}]`);
      var postfix = genPostfix(type, focusObj);
      node.nodes[i] = `${prefix} ${node.nodes[i]} ${postfix}`;
    }

    node.nodes.sort(function (a, b) {
      return stripAnsi(a).localeCompare(stripAnsi(b));
    });
    tree = tree || node;
    currentNode.nodes.push(node);
    currentNode = node;
  }
  console.log(archy(tree));
}

function json(obj) {
  var replacer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var spacer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

  console.log(stringify(obj, replacer, spacer));
}

function newNode(label) {
  return {
    label,
    nodes: []
  };
}

function genHeader(obj) {
  var constName = obj.constructor.name ? obj.constructor.name : '';
  var objName = obj.name ? obj.name : '';
  var objSignature = genSignature(obj.toString());
  var header = constName.length > 0 ? `[${constName}]` : `[${typeof obj}]`;
  header = chalk.red(header);
  if (objName.length > 0) header += ` ${objName}`;
  if (objSignature.length > 0) header += ` ${objSignature}`;
  return header;
}

function genType(obj) {
  var type = types.unk;
  if (obj == null) return type;
  if (Array.isArray(obj)) return types.arr;
  try {
    type = typeof obj;
    type = type.slice(0, 3).toLowerCase();
  } catch (err) {}
  return type;
}

function genPostfix(type, obj) {
  var postfix = '';
  switch (type) {
    case types.arr:
      postfix = applyChalk(type, `[len: ${obj.length}]`);
      break;
    case types.boo:
      postfix = applyChalk(type, `[${obj.toString()}]`);
      break;
    case types.fun:
      var signature = genSignature(obj.toString());
      postfix = applyChalk(type, signature);
      break;
    case types.num:
      postfix = applyChalk(type, `[${obj.toString()}]`);
      break;
    case types.obj:
      postfix = applyChalk(type, `[keys: ${Object.getOwnPropertyNames(obj).length}]`);
      break;
    case types.str:
      var str = obj.replace(/(?:\r\n|\r|\n)/g, '');
      str = str.length > 10 ? str.substring(0, 10) + '...' : str;
      postfix = applyChalk(type, `[${str}]`);
      break;
    default:
      break;
  }
  return postfix;
}

function applyChalk(type, str) {
  var result = void 0;
  switch (type) {
    case types.arr:
      result = chalk.yellow(str);
      break;
    case types.boo:
      result = chalk.cyan(str);
      break;
    case types.fun:
      result = chalk.green(str);
      break;
    case types.num:
      result = chalk.blue(str);
      break;
    case types.obj:
      result = chalk.yellow(str);
      break;
    case types.str:
      result = chalk.magenta(str);
      break;
    default:
      result = str;
      break;
  }
  return result;
}

function genSignature(funString) {
  return funString.slice(funString.indexOf('('), funString.indexOf(')') + 1);
}
