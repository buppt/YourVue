export function generate(ast){
  const code = ast ? genElement(ast) : '_c("div")'
  return `with(this){return ${code}}`
}

function genElement(el){
  let code
  let data = genData(el)
  const children = el.inlineTemplate ? null : genChildren(el, true)
  code = `_c('${el.tag}'${
    data ? `,${data}` : '' // data
  }${
    children ? `,${children}` : '' // children
  })`
  return code
}


export function genChildren (el){
  const children = el.children
  if (children.length) {
    const el = children[0]
    return `[${children.map(c => genNode(c)).join(',')}]`
  }
}
function genNode (node) {
  if (node.type === 1) {
    return genElement(node)
  } else if (node.type === 3 && node.isComment) {
    return `_e(${JSON.stringify(node.text)})`
  } else {
    return `_v(${node.type === 2
      ? node.expression
      :JSON.stringify(node.text)
    })`
  }
}

function genData(el){
  let data = '{'
  if (el.attrs) {
    data += `attrs:${genProps(el.attrs)},`
  }
  if (el.props) {
    data += `domProps:${genProps(el.props)},`
  }
  if (el.events) {
    data += `on:${genHandlers(el.events)},`
  }
  data = data.replace(/,$/, '') + '}'
  return data
}

function genProps (props){
  let staticProps = ``
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    const value = prop.value
    staticProps += `"${prop.name}":${value},`
  }
  staticProps = `{${staticProps.slice(0, -1)}}`
  return staticProps
}

function genHandlers(events){
  let res = '{'
  for(let key in events){
    res += key + ':' + events[key].value
  }
  res += '}'
  return res
}