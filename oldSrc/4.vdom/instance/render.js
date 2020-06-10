import { VNode } from '../vdom/vnode'

export function initRender(vm){
    vm._c = createElement
    vm._v = createTextVNode
    vm._s = toString
    vm._e = createEmptyVNode
}
function createElement (tag, data={}, children=[]){
    children = simpleNormalizeChildren(children)
    return new VNode(tag, data, children, undefined, undefined)
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