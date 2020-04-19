import { templateToDom } from './compiler'

export default class YourVue{
    constructor(options){
        this.$options = options
        initEvent(this)
        initData(this)
        this.$mount(this.$options.el)
    }
    $mount(el){
        el = el && query(el)
        if(this.$options.template){
            this.el = templateToDom(this.$options.template, this)
            el.innerHTML = ''
            el.appendChild(this.el)
        }
    }
    setState(data){
        Object.keys(data).forEach(key => {
            this[key] = data[key]
        })
        this.$mount(this.$options.el)
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
function initEvent(vm){
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