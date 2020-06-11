import { templateToCode } from '../compiler/compiler'
import { observe } from '../observer/index'
import { Watcher} from '../observer/watcher'
import { patch } from '../vdom/patch'
import { initRender } from './render'

let cid = 1

export default class YourVue{
    constructor(options){
        this._init(options)
    }
    _init(options){
        this.$options = options
        if(options._isComponent){
            this._parentListeners = options._parentVnode.componentOptions.listeners
        }
        initRender(this)
        if (options.data) initData(this)
        if (options.methods) initMethod(this)
        if(options.el){
            this.$mount()
        }
    }
    $mount(){
        const options = this.$options
        if (!options.render) {
            let template = options.template
            if (template) {
                const code = templateToCode(template)
                const render = new Function(code).bind(this)
                options.render = render
            }
        }
        const vm = this
        new Watcher(vm, vm.update.bind(vm), noop)
    }
    update(){
        if(this.$options.template){
            if(this._isMounted){
                const vnode = this.$options.render()
                patch(this.vnode, vnode)
                this.vnode = vnode
            }else{
                this.vnode = this.$options.render()
                console.log(this.vnode);
                
                let el = this.$options.el
                this.el = el && query(el)
                patch(this.vnode, null, this.el)
                this._isMounted = true
            }
        }
    }
    static extend(extendOptions){
        extendOptions = extendOptions || {}
        const Super = this
        const SuperId = Super.cid
        const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
        if (cachedCtors[SuperId]) {
            return cachedCtors[SuperId]
        }
        const Sub = function VueComponent (options) {
            this._init(mergeOptions(options,extendOptions))
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.cid = cid++
        Sub['super'] = Super
        Sub.extend = Super.extend
        cachedCtors[SuperId] = Sub
        return Sub
    }
}

function query(el){
    if(typeof el === 'string'){
        const selected = document.querySelector(el)
        if(!selected){
            return document.createElement('div')
        }
        return selected
    }else{
        return el
    }
}

function initMethod(vm){
    let event = vm.$options.methods
    Object.keys(event).forEach(key => {
        vm[key] = event[key].bind(vm)
    })
}

function initData(vm){
    let data = vm.$options.data
    vm._data = data
    data = vm._data = typeof data === 'function'
        ? data.call(vm, vm)
        : data || {}
    Object.keys(data).forEach(key => {
        proxy(vm, '_data', key)
    })
    observe(data)
}
function noop () {}
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
}

export function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function mergeOptions(obj1, obj2){
    if(obj2){
        Object.keys(obj2).forEach(key => {
            obj1[key] = obj2[key]
        })
    }
    return obj1
}