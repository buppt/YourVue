import directives from './directives'
export function generate(ast){
    const code = ast ? genElement(ast) : '_c("div")'
    return `with(this){return ${code}}`
}

function genElement(el){
  if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.tag === 'slot') {
    return genSlot(el)
  } else {
    let code
    if (el.component) {
    //   code = genComponent(el.component, el)
    } else {
      let data = genData(el)
      const children = el.inlineTemplate ? null : genChildren(el, true)
      code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`
    }
    return code
  }
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
    const dirs = genDirectives(el)
    if (dirs) data += dirs + ','
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

function genSlot(el){
  const slotName = el.slotName || '"default"'
  const children = genChildren(el)
  return `_t(${slotName}${children ? `,${children}` : ''})`
}

export function genFor (el) {
  const exp = el.for
  const alias = el.alias
  const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
  const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''
  el.forProcessed = true // avoid recursion
  return `_l((${exp}),` +
    `function(${alias}${iterator1}${iterator2}){` +
      `return ${genElement(el)}` +
    '})'
}

export function genIf (el){
  el.ifProcessed = true // avoid recursion
  return genIfConditions(el.ifConditions.slice())
}
function genIfConditions (conditions) {
  if (!conditions.length) {
    return '_e()'
  }

  const condition = conditions.shift()
  if (condition.exp) {
    return `(${condition.exp})?${
      genElement(condition.block)
    }:${
      genIfConditions(conditions)
    }`
  } else {
    return `${genElement(condition.block)}`
  }
}

function genDirectives(el){
  const dirs = el.directives
  if (!dirs) return
  let res = 'directives:['
  let i, l, dir
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i]
    const gen = directives[dir.name]
    if(gen){
      gen(el, dir)
    }
    res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
      dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
    }${
      dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
    }${
      dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
    }},`
  }

  return res.slice(0, -1) + ']'

}