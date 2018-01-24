const archy = require('archy')
const chalk = require('chalk')

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
      let type = '---'
      try { type = typeof obj[node.nodes[i]] } catch (err) { }
      const prefix = genPrefix(type)
      const postfix = type === 'function' ? genSignature(obj[node.nodes[i]].toString()) : ''
      node.nodes[i] = `${prefix} ${node.nodes[i]} ${postfix}`
    }

    node.nodes.sort()
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
  let header = '['
  if (constName.length > 0) {
    header += `${capitalize(constName)}]`
  } else {
    header += `${capitalize(typeof obj)}]`
  }
  header = chalk.red(header)
  if (objName.length > 0) header += ` ${objName}`
  if (objSignature.length > 0) header += ` ${objSignature}`
  return header
}

function capitalize (value) {
  value = value.toLowerCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function genPrefix (value) {
  let result = `[${value.slice(0, 3)}]`.toLowerCase()
  switch (result) {
    case '[fun]':
      result = chalk.green(result)
      break
    case '[str]':
      result = chalk.magenta(result)
      break
    case '[num]':
      result = chalk.blue(result)
      break
    case '[boo]':
      result = chalk.cyan(result)
      break
    case '[obj]':
      result = chalk.yellow(result)
      break
    default:
      break
  }
  return result
}

function genSignature (functionString) {
  return functionString.slice(functionString.indexOf('('), functionString.indexOf(')') + 1)
}
