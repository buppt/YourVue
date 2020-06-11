import { templateToCode } from '../compiler/compiler'
import { observe } from '../observer/index'
import { Watcher} from '../observer/watcher'
import { patch } from '../vdom/patch'
import { initRender } from './render'

export default class YourVue{
    constructor(options){
        this._init(options)
    }
    _init(options){
        this.$options = options
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
                let el = this.$options.el
                this.el = el && query(el)
                patch(this.vnode, null, this.el)
                this._isMounted = true
            }
        }
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

function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter (val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}