const archy = require('archy')
const chalk = require('chalk')

console.probe = function genProbe (obj) {
  let tree = null
  let currentNode = newNode('root')

  for (;obj != null; obj = Object.getPrototypeOf(obj)) {
    const node = newNode(chalk.red(`[${obj.constructor.name}]`))
    node.nodes = Object.getOwnPropertyNames(obj)

    for (let i = 0; i < node.nodes.length; i++) {
      const type = typeof obj[node.nodes[i]]
      const prefix = genPrefix(type)
      const postfix = type === 'function' ? genPostfix(obj, node.nodes[i]) : ''
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

function genPrefix (value) {
  let result = `[${value.slice(0, 3)}]`
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

function genPostfix (obj, functionName) {
  let signature = obj[functionName].toString()
  signature = signature.slice(signature.indexOf('('), signature.indexOf(')') + 1)
  return signature
}
