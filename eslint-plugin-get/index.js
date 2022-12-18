const handle = (node, {options, report}) => {

  const funcName = node.id ? node.id.name : node.parent.id.name
  const content = node.body.body

  const isGetFunc = funcName.startsWith('get')
  const notHasReturn = content.filter(d => d.type === 'ReturnStatement').length === 0

  const [{content: returnContent}] = options

  if (isGetFunc && notHasReturn) {
    report({
      node,
      message: `"${funcName}" startWith "get", it must has return something`,
      fix(fixer) {
        return fixer.replaceTextRange([node.range[1] - 1, node.range[1]], `  return \'${returnContent}\'\n}`)
      }
    })
  }
}

module.exports = {
  rules: {
    "getter-function-must-return": {
      meta: {
        fixable: 'code'
      },
      create: function (context) {
        return {
          FunctionDeclaration: (node) => handle(node, context),
          ArrowFunctionExpression: (node) => handle(node, context)
        }
      }
    }
  }
}