import { VNode } from '../vdom/vnode'
import { componentToVNode } from '../vdom/create-component'

export function initRender(vm){
    vm._c = createElement
    vm._v = createTextVNode
    vm._s = toString
    vm._e = createEmptyVNode
    vm._l = renderList
}
function createElement (tag, data={}, children=[]){
    children = simpleNormalizeChildren(children)
    if(isHTMLtag(tag)){
        return new VNode(tag, data, children, undefined, undefined)
    }else{
        return componentToVNode(tag, data, children, this)
    }
}

export function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
}

export function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }
export function createEmptyVNode (text) {
    const node = new VNode()
    node.text = text
    node.isComment = true
    return node
}

export function simpleNormalizeChildren (children) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

function isHTMLtag(tag){
  let str = 'template,script,style,element,content,slot,link,meta,svg,view,' +
      'a,div,img,image,text,span,input,switch,textarea,spinner,select,button,h1,h2,h3,h4,h5,h6,p,' +
      'slider,slider-neighbor,indicator,canvas,' +
      'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
      'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown'
  return str.split(',').includes(tag)
}

function renderList (val, render){
  let ret, i, l, keys, key
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length)
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i)
    }
  } else if (typeof val === 'number') {
    ret = new Array(val)
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i)
    }
  } else {
      keys = Object.keys(val)
      ret = new Array(keys.length)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        ret[i] = render(val[key], key, i)
      }
  }
  if (!ret) {
    ret = []
  }
  ret._isVList = true
  return ret
}