import {VNode} from '../vdom/vnode'
import {componentToVNode} from '../vdom/create-component'
export function initRender(vm){
    const options = vm.$options
    const parentVnode = options._parentVnode
    const renderContext = parentVnode && parentVnode.context
    if(parentVnode){
      vm.$slots = resolveSlots(parentVnode.componentOptions.children, renderContext)
    }
    console.log(vm.$slots);
    
    vm._c = createElement
    vm._v = createTextVNode
    vm._s = toString
    vm._e = createEmptyVNode
    vm._t = renderSlot 
}
function createElement (tag, data={}, children=[]){
    if(isHTMLtag(tag)){
      // if(tag === 'slot')
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

function isHTMLtag(tag){
    let str = 'template,script,style,element,content,slot,link,meta,svg,view,' +
        'a,div,img,image,text,span,input,switch,textarea,spinner,select,button,h1,h2,h3,h4,h5,h6,p,' +
        'slider,slider-neighbor,indicator,canvas,' +
        'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
        'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown'
    return str.split(',').includes(tag)
}

export function renderSlot (name, fallback, props){
    let nodes
    const slotNodes = this.$slots && this.$slots[name]
    if (slotNodes) {
     slotNodes._rendered = true
    }
    nodes = slotNodes || fallback
    return nodes
  }

function resolveSlots(children, context){
    const slots = {}
    if (!children) {
      return slots
    }
    for (let i = 0, l = children.length; i < l; i++) {
      const child = children[i]
      if(!child.tag){
        continue
      }
      let name
      if(child.props && child.props.attrs){
        name = child.props.attrs.slot
      }
      if(name){
        slots[name] = child
      } else {
        slots.default=child
      }
    }
    return slots
}