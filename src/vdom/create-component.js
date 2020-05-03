import YourVue, {proxy} from '../instance/instance'
import { VNode } from './vnode'
import {defineReactive} from '../observer/index'
import {patch} from './patch'

export function componentToVNode(tag, data, children, vm){
    if(tag.includes('-')){
        tag = toHump(tag)
    }
    const Ctor = YourVue.extend(vm.$options.components[tag])
    const name = tag
    data.hooks = {
        init(vnode){
            const child = vnode.componentInstance = new vnode.componentOptions.Ctor({
                _isComponent: true,
                _parentVnode: vnode
            })
            initProps(child, vnode.props.attrs)
            child.$mount()
        },
        prepatch (oldVnode, vnode) {
            const options = vnode.componentOptions
            const child = vnode.componentInstance = oldVnode.componentInstance
            const attrs = options.data.attrs;
            for (const key in attrs) {
                if(key === 'on'){
                    continue
                }
                child._props[key] = attrs[key]
            }
          }
    }
    const listeners = data.on
    const vnode = new VNode(
        `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, vm,
        { Ctor, tag, data, listeners}
    )
    return vnode
}

function toHump(name) {
    return name.replace(/-(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}

function initProps(vm, propsOptions){
    const props = vm._props = {}
    for (const key in propsOptions) {
        if(key === 'on'){
            continue
        }
        defineReactive(props, key, propsOptions[key])
        if (!(key in vm)) {
            proxy(vm, `_props`, key)
        }
    }
}