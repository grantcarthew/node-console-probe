const chalk = require('chalk')
const stripAnsi = require('strip-ansi')
const archy = require('archy')
const types = require('./types')
const valid = require('./valid')

module.exports = function probe (obj) {
  if (!valid(obj)) { return }

  let tree = null
  let currentNode = newNode('root')

  for (;obj != null; obj = Object.getPrototypeOf(obj)) {
    let node = newNode(genHeader(obj))
    node.nodes = Object.getOwnPropertyNames(obj)
    node.nodes.push(...Object.getOwnPropertySymbols(obj))
    node = processNode(node, obj)
    tree = tree || node
    currentNode.nodes.push(node)
    currentNode = node
  }
  console.log(archy(tree))
}

function processNode (node, obj) {
  for (let i = 0; i < node.nodes.length; i++) {
    let focusObj = null
    let propertyIsGetter = false
    let type
    try {
      propertyIsGetter = isGetter(obj, node.nodes[i])
      focusObj = obj[node.nodes[i]]
      type = getTypeString(focusObj)
    } catch (err) {
      type = propertyIsGetter ? types.Getter : types.Unknown
      focusObj = err
    }
    node.nodes[i] = getNodeString(type, focusObj, node.nodes[i])
  }
  node.nodes.sort((a, b) => {
    return stripAnsi(a).localeCompare(stripAnsi(b))
  })
  return node
}

function getNodeString (type, obj, node) {
  let prefix = applyChalk(type, `[${type}]`)
  const postfix = genPostfix(type, obj)
  const isSymbolKey = getTypeString(node) === types.Symbol
  if (isSymbolKey) {
    const symDesc = getSymbolDescription(node)
    prefix = applyChalk(types.Symbol, `[${types.Symbol}]`) + prefix
    if (symDesc) {
      return `${prefix} ${symDesc} ${postfix}`
    } else {
      return `${prefix} ${postfix}`
    }
  }
  return `${prefix} ${node} ${postfix}`
}

function newNode (label) {
  return {
    label,
    nodes: []
  }
}

function genHeader (obj) {
  const constName = obj.constructor.name ? obj.constructor.name : ''
  let objName = isGetter(obj, 'name') ? applyChalk(types.Getter, `[${types.Getter}] name ()`) : ''
  try { objName = obj.name && obj.name } catch (err) { }
  const objSignature = genSignature(obj)
  let header = constName ? `[${constName}]` : `[${typeof obj}]`
  header = chalk.red(header)
  header += objName ? ` ${objName}` : ''
  header += objSignature ? ` ${objSignature}` : ''
  return header
}

function isGetter (obj, propertyName) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, propertyName)
  return !!(descriptor && descriptor.get && typeof descriptor.get === 'function')
}

function getTypeString (obj) {
  if (Number.isNaN(obj)) return types.NaN
  return Object.prototype.toString.call(obj).slice(8, -1)
}

function genPostfix (type, obj) {
  let postfix = ''
  let symDesc = ''
  switch (type) {
    case types.Infinity:
    case types.NaN:
    case types.Undefined:
    case types.Null:
      break
    case types.Object:
      postfix = applyChalk(type, `[keys: ${Object.getOwnPropertyNames(obj).length}]`)
      break
    case types.Function:
    case types.GeneratorFunction:
    case types.AsyncFunction:
      postfix = applyChalk(type, genSignature(obj))
      break
    case types.Boolean:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.Symbol:
      symDesc = getSymbolDescription(obj)
      if (symDesc) {
        postfix = applyChalk(type, `[desc: ${symDesc}]`)
      }
      break
    case types.Error:
      postfix = obj.message && applyChalk(type, `[${cleanString(obj.message)}]`)
      break
    case types.Number:
    case types.BigInt:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.Date:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.String:
      postfix = applyChalk(type, `[${cleanString(obj)}]`)
      break
    case types.RegExp:
      postfix = applyChalk(type, `[${limitString(obj.toString())}]`)
      break
    case types.Array:
    case types.Int8Array:
    case types.Uint8Array:
    case types.Uint8ClampedArray:
    case types.Int16Array:
    case types.Uint16Array:
    case types.Int32Array:
    case types.Uint32Array:
    case types.Float32Array:
    case types.Float64Array:
      postfix = applyChalk(type, `[len: ${obj.length}]`)
      break
    case types.Map:
    case types.Set:
      postfix = applyChalk(type, `[size: ${obj.size}]`)
      break
    case types.ArrayBuffer:
    case types.SharedArrayBuffer:
    case types.DataView:
      postfix = applyChalk(type, `[len: ${obj.byteLength}]`)
      break
    default:
      break
  }
  return postfix
}

function cleanString (value) {
  const str = value.replace(/(?:\r\n|\r|\n)/g, '')
  return limitString(str)
}

function limitString (value) {
  const limit = 15
  return value.length > limit ? value.substring(0, limit) + '...' : value
}

function getSymbolDescription (sym) {
  return String(sym).slice(7, -1)
}

function applyChalk (type, str) {
  let result
  switch (type) {
    // Null Types
    case types.Infinity:
    case types.NaN:
    case types.Undefined:
    case types.Null:
      result = str // No colour
      break
    // Objects and Properties
    case types.Object:
    case types.Symbol:
    case types.Date:
      result = chalk.yellow(str)
      break
    // Collections and Arrays
    case types.Array:
    case types.Int8Array:
    case types.Uint8Array:
    case types.Uint8ClampedArray:
    case types.Int16Array:
    case types.Uint16Array:
    case types.Int32Array:
    case types.Uint32Array:
    case types.Float32Array:
    case types.Float64Array:
    case types.Map:
    case types.Set:
    case types.WeakMap:
    case types.WeakSet:
      result = chalk.blue(str)
      break
    // Structured Data and Boolean
    case types.Boolean:
    case types.ArrayBuffer:
    case types.SharedArrayBuffer:
    case types.Atomics:
    case types.DataView:
      result = chalk.cyan(str)
      break
    // Functions and Control Objects
    case types.Getter:
    case types.Function:
    case types.Promise:
    case types.Generator:
    case types.GeneratorFunction:
    case types.AsyncFunction:
      result = chalk.green(str)
      break
    // Number Types
    case types.Number:
    case types.BigInt:
      result = chalk.blue(str)
      break
    // Strings
    case types.String:
    case types.RegExp:
      result = chalk.magenta(str)
      break
    // Errors
    case types.Error:
      result = chalk.red(str)
      break
    default:
      result = str
      break
  }
  return result
}

function genSignature (obj) {
  let funString = ''
  if (!isFunction(obj)) { return funString }
  try {
    funString = Function.prototype.toString.call(obj)
    funString = funString.slice(funString.indexOf('('), funString.indexOf(')') + 1)
  } catch (err) { }
  return funString.slice(funString.indexOf('('), funString.indexOf(')') + 1)
}

function isFunction (obj) {
  const type = getTypeString(obj)
  return type === types.Function || type === types.GeneratorFunction || type === types.AsyncFunction
}
