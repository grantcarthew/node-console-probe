'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var prettyJson = require('prettyjson');
var fastSafeStringify = require('fast-safe-stringify');
var jsonColorizer = require('json-colorizer');
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
  sym: 'sym',
  und: 'und',
  nul: 'nul',
  err: 'err'
});

module.exports = Object.freeze({
  apply,
  probe,
  json,
  yaml
});

function apply(obj) {
  if (obj == null) {
    global.console.json = json;
    global.console.yaml = yaml;
    global.console.probe = probe;
  } else {
    obj.json = json;
    obj.yaml = yaml;
    obj.probe = probe;
  }
}

function json(obj) {
  var replacer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var spacer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var asString = fastSafeStringify(obj, replacer, spacer);
  console.log(jsonColorizer(asString, color));
}

function yaml(obj, options, indentation) {
  console.log(prettyJson.render(obj, options, indentation));
}

function probe(obj) {
  if (obj == null || genType(obj) === types.sym) {
    console.log(obj);
    return;
  }

  var tree = null;
  var currentNode = newNode('root');

  for (; obj != null; obj = Object.getPrototypeOf(obj)) {
    var _node$nodes;

    var node = newNode(genHeader(obj));
    node.nodes = Object.getOwnPropertyNames(obj);
    (_node$nodes = node.nodes).push.apply(_node$nodes, _toConsumableArray(Object.getOwnPropertySymbols(obj)));

    for (var i = 0; i < node.nodes.length; i++) {
      var focusObj = null;
      var type = void 0;
      var isSymbolKey = genType(node.nodes[i]) === types.sym;
      try {
        focusObj = obj[node.nodes[i]];
        type = genType(focusObj);
      } catch (err) {
        type = types.err;
      }
      var prefix = applyChalk(type, `[${type}]`);
      var postfix = genPostfix(type, focusObj);
      if (isSymbolKey) {
        var symDesc = getSymbolDescription(node.nodes[i]);
        prefix = applyChalk(types.sym, `[${types.sym}]`) + prefix;
        if (symDesc.length > 0) {
          node.nodes[i] = `${prefix} ${symDesc} ${postfix}`;
        } else {
          node.nodes[i] = `${prefix} ${postfix}`;
        }
      } else {
        node.nodes[i] = `${prefix} ${node.nodes[i]} ${postfix}`;
      }
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
  var type = types.err;
  if (obj === null) return types.nul;
  if (obj === undefined) return types.und;
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
    case types.und:
    case types.nul:
      break;
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
      postfix = applyChalk(type, `[${cleanString(obj)}]`);
      break;
    case types.sym:
      var symDesc = getSymbolDescription(obj);
      if (symDesc.length > 0) {
        postfix = applyChalk(type, `[desc: ${getSymbolDescription(obj)}]`);
      }
      break;
    default:
      break;
  }
  return postfix;
}

function cleanString(value) {
  var str = value.replace(/(?:\r\n|\r|\n)/g, '');
  var limit = 15;
  return str.length > limit ? str.substring(0, limit) + '...' : str;
}

function getSymbolDescription(sym) {
  return String(sym).slice(7, -1);
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
    case types.sym:
      result = chalk.yellow(str);
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
