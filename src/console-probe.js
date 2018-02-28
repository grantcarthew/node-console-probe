const types = require('./types')
const archy = require('archy')
const chalk = require('chalk')
const stripAnsi = require('strip-ansi')

String.prototype.center = function (width, padding) {
  padding = padding || ' ';
  padding = padding.substr(0, 1)
	if (this.length < width) {
    var len		= width - this.length
		var remain	= (len % 2 == 0) ? '' : padding
		var pads	= padding.repeat(parseInt(len / 2))
		return pads + this + pads + remain
	} else
    {return this;}
}

module.exports = function probe (obj) {
  if (obj == null || getTypeString(obj) === types.Symbol) {
    console.log(obj)
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
        type = types.Error
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
  const objSignature = genSignature(obj.toString())
  let header = constName.length > 0 ? `[${constName}]` : `[${typeof obj}]`
  header = chalk.red(header)
  if (objName.length > 0) header += ` ${objName}`
  if (objSignature.length > 0) header += ` ${objSignature}`
  return header
}

function getTypeString (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

function genPostfix (type, obj) {
  let postfix = ''
  switch (type) {
    case types.Undefined:
    case types.Null:
    case types.NaN:
      break
    case types.Array:
      postfix = applyChalk(type, `[len: ${obj.length}]`)
      break
    case types.Boolean:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.Function:
      const signature = genSignature(obj.toString())
      postfix = applyChalk(type, signature)
      break
    case types.Number:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.Object:
      postfix = applyChalk(type, `[keys: ${Object.getOwnPropertyNames(obj).length}]`)
      break
    case types.String:
      postfix = applyChalk(type, `[${cleanString(obj)}]`)
      break
    case types.Symbol:
      const symDesc = getSymbolDescription(obj)
      if (symDesc.length > 0) {
        postfix = applyChalk(type, `[desc: ${getSymbolDescription(obj)}]`)
      }
      break
    case types.Map:
    case types.Set:
      postfix = applyChalk(type, `[size: ${obj.size}]`)
      break
    default:
      break
  }
  return postfix
}

function cleanString (value) {
  let str = value.replace(/(?:\r\n|\r|\n)/g, '')
  const limit = 15
  return str.length > limit ? str.substring(0, limit) + '...' : str
}

function getSymbolDescription (sym) {
  return String(sym).slice(7, -1)
}

function applyChalk (type, str) {
  let result
  switch (type) {
    case types.Array:
      result = chalk.yellow(str)
      break
    case types.Boolean:
      result = chalk.cyan(str)
      break
    case types.Function:
      result = chalk.green(str)
      break
    case types.Number:
      result = chalk.blue(str)
      break
    case types.String:
      result = chalk.magenta(str)
      break
    case types.Object:
    case types.Symbol:
    case types.Map:
    case types.Set:
      result = chalk.yellow(str)
      break
    default:
      result = str
      break
  }
  return result
}

function genSignature (funString) {
  return funString.slice(funString.indexOf('('), funString.indexOf(')') + 1)
}
