const archy = require('archy')
const chalk = require('chalk')
const stripAnsi = require('strip-ansi')
const types = Object.freeze({
  arr: 'arr',
  boo: 'boo',
  fun: 'fun',
  num: 'num',
  obj: 'obj',
  str: 'str',
  unk: '---'
})

module.exports = Object.freeze({
  apply (obj) {
    if (obj == null) {
      global.console.probe = probe
    } else {
      obj.probe = probe
    }
  },
  get () {
    return probe
  }
})

function probe (obj) {
  if (obj == null) {
    console.log(obj)
    return
  }

  let tree = null
  let currentNode = newNode('root')

  for (;obj != null; obj = Object.getPrototypeOf(obj)) {
    const node = newNode(genHeader(obj))
    node.nodes = Object.getOwnPropertyNames(obj)

    for (let i = 0; i < node.nodes.length; i++) {
      let focusObj = null
      try { focusObj = obj[node.nodes[i]] } catch (err) {}
      const type = genType(focusObj)
      const prefix = genPrefix(type)
      const postfix = genPostfix(type, focusObj)
      node.nodes[i] = `${prefix} ${node.nodes[i]} ${postfix}`
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

function genType (obj) {
  let type = types.unk
  if (obj == null) return type
  if (Array.isArray(obj)) return types.arr
  try {
    type = typeof obj
    type = type.slice(0, 3).toLowerCase()
  } catch (err) { }
  return type
}

function genPrefix (type) {
  let result
  switch (type) {
    case types.arr:
      result = applyChalk(type, `[${type}]`)
      break
    case types.boo:
      result = applyChalk(type, `[${type}]`)
      break
    case types.fun:
      result = applyChalk(type, `[${type}]`)
      break
    case types.num:
      result = applyChalk(type, `[${type}]`)
      break
    case types.obj:
      result = applyChalk(type, `[${type}]`)
      break
    case types.str:
      result = applyChalk(type, `[${type}]`)
      break
    default:
      result = `[${type}]`
      break
  }
  return result
}

function genPostfix (type, obj) {
  let postfix = ''
  switch (type) {
    case types.arr:
      postfix = applyChalk(type, `[len: ${obj.length}]`)
      break
    case types.boo:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.fun:
      const signature = genSignature(obj.toString())
      postfix = applyChalk(type, signature)
      break
    case types.num:
      postfix = applyChalk(type, `[${obj.toString()}]`)
      break
    case types.obj:
      postfix = applyChalk(type, `[keys: ${Object.getOwnPropertyNames(obj).length}]`)
      break
    case types.str:
      const str = obj.length > 10 ? obj.substring(0, 10) + '...' : obj
      postfix = applyChalk(type, `[${str}]`)
      break
    default:
      break
  }
  return postfix
}

function applyChalk (type, str) {
  let result
  switch (type) {
    case types.arr:
      result = chalk.yellow(str)
      break
    case types.boo:
      result = chalk.cyan(str)
      break
    case types.fun:
      result = chalk.green(str)
      break
    case types.num:
      result = chalk.blue(str)
      break
    case types.obj:
      result = chalk.yellow(str)
      break
    case types.str:
      result = chalk.magenta(str)
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
