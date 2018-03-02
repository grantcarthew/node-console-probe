const types = require('./types')
const archy = require('archy')
const chalk = require('chalk')
const stripAnsi = require('strip-ansi')

module.exports = function probe (obj) {
  if (obj == null) {
    const message = chalk.red('[console-probe] Invalid Type: ')
    console.log(message + obj)
    return
  }

  let tree = null
  let currentNode = newNode('root')

  for (;obj != null; obj = Object.getPrototypeOf(obj)) {
    const node = newNode(genHeader(obj))
    node.nodes = Object.getOwnPropertyNames(obj)
    node.nodes.push(...Object.getOwnPropertySymbols(obj))

    for (let i = 0; i < node.nodes.length; i++) {
      let focusObj = null
      let type
      let isSymbolKey = getTypeString(node.nodes[i]) === types.Symbol
      try {
        focusObj = obj[node.nodes[i]]
        type = getTypeString(focusObj)
      } catch (err) {
        type = types.Unknown
        focusObj = err
      }
      let prefix = applyChalk(type, `[${type}]`)
      const postfix = genPostfix(type, focusObj)
      if (isSymbolKey) {
        const symDesc = getSymbolDescription(node.nodes[i])
        prefix = applyChalk(types.Symbol, `[${types.Symbol}]`) + prefix
        if (symDesc.length > 0) {
          node.nodes[i] = `${prefix} ${symDesc} ${postfix}`
        } else {
          node.nodes[i] = `${prefix} ${postfix}`
        }
      } else {
        node.nodes[i] = `${prefix} ${node.nodes[i]} ${postfix}`
      }
    }

    node.nodes.sort((a, b) => {
      return stripAnsi(a).localeCompare(stripAnsi(b))
    })
    tree = tree || node
    currentNode.nodes.push(node)
    currentNode = node
  }
  console.log(archy(tree))
}

function newNode (label) {
  return {
    label,
    nodes: []
  }
}

function genHeader (obj) {
  const constName = obj.constructor.name ? obj.constructor.name : ''
  const objName = obj.name ? obj.name : ''
  const type = getTypeString(obj)
  let objSignature = ''
  if (type === types.Function ||
      type === types.GeneratorFunction ||
      type === types.AsyncFunction) {
    objSignature = genSignature(obj)
  }
  let header = constName.length > 0 ? `[${constName}]` : `[${typeof obj}]`
  header = chalk.red(header)
  if (objName.length > 0) header += ` ${objName}`
  if (objSignature.length > 0) header += ` ${objSignature}`
  return header
}

function getTypeString (obj) {
  if (Number.isNaN(obj)) return types.NaN
  return Object.prototype.toString.call(obj).slice(8, -1)
}

function genPostfix (type, obj) {
  let postfix = ''
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
      const signature = genSignature(obj)
      postfix = applyChalk(type, signature)
      break
    case types.Boolean:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.Symbol:
      const symDesc = getSymbolDescription(obj)
      if (symDesc.length > 0) {
        postfix = applyChalk(type, `[desc: ${getSymbolDescription(obj)}]`)
      }
      break
    case types.Error:
      postfix = obj.message && applyChalk(type, `[${cleanString(obj.message)}]`)
      break
    case types.Number:
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
  let str = value.replace(/(?:\r\n|\r|\n)/g, '')
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
    case types.Function:
    case types.Promise:
    case types.Generator:
    case types.GeneratorFunction:
    case types.AsyncFunction:
      result = chalk.green(str)
      break
    // Number Types
    case types.Number:
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
  try {
    funString = Function.prototype.toString.call(obj)
    funString = funString.slice(funString.indexOf('('), funString.indexOf(')') + 1)
  } catch (err) { }
  return funString.slice(funString.indexOf('('), funString.indexOf(')') + 1)
}
