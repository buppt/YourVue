export function generate(ast){
    const code = ast ? genElement(ast) : '_c("div")'
    return `with(this){return ${code}}`
}

function genElement(el){
    let code
    if (el.component) {
    //   code = genComponent(el.component, el)
    } else {
      let data = genData(el)
      console.log(el, data);
      
      const children = el.inlineTemplate ? null : genChildren(el, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
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
    if (el.staticClass) {
      data += `staticClass:${el.staticClass},`
    }
    if (el.classBinding) {
      data += `class:${el.classBinding},`
    }
    if (el.attrs) {
      data += `attrs:${genProps(el.attrs)},`
    }
    // DOM props
    if (el.props) {
      data += `domProps:${genProps(el.props)},`
    }
    // event handlers
    if (el.events) {
      data += `on:${genHandlers(el.events)},`
    }
    data = data.replace(/,$/, '') + '}'
    return data
}

function genProps (props){
  let staticProps = ``
  let dynamicProps = ``
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    const value = prop.value
    if (prop.dynamic) {
      dynamicProps += `${prop.name},${value},`
    } else {
      staticProps += `"${prop.name}":${value},`
    }
  }
  staticProps = `{${staticProps.slice(0, -1)}}`
  if (dynamicProps) {
    return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`
  } else {
    return staticProps
  }
}

function genHandlers(events){
  let res = '{'
  for(let key in events){
    res += key + ':' +events[key].value
  }
  res += '}'
  return res
}