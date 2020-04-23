import { templateToVnode } from './compiler'
import { observe,defineReactive } from './observer/index'
import { Watcher } from './observer/watcher'
import  {Dep } from './observer/dep'
import { patch } from './vdom/patch'
import { callHook } from './lifecycle'

let cid = 1
export default class YourVue{
    constructor(options){
        this._init(options)
    }
    _init(options){
        this.$options = options
        initEvent(this)
        callHook(this, 'beforeCreate')
        if(options.data) initData(this)
        if (options.computed) initComputed(this, options.computed)
        if (options.watch) initWatch(this, options.watch)
        callHook(this, 'created')
        if(options.el){
            this.$mount()
        }
    }
    $mount(){
        const vm = this
        new Watcher(vm, vm.update.bind(vm), noop)
    }
    update(){
        if(this.$options.template){
            if(this._isMounted){
                callHook(this, 'beforeUpdate')
                const vnode = templateToVnode(this.$options.template, this)
                patch(this.vnode, vnode)
                this.vnode = vnode
                callHook(this, 'updated')
            }else{
                callHook(this, 'beforeMount')
                this.vnode = templateToVnode(this.$options.template, this)
                let el = this.$options.el
                this.el = el && query(el)
                patch(this.vnode, null, this.el)
                this._isMounted = true
                callHook(this, 'mounted')
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

YourVue.cid = 0

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
    const event = vm.$options && vm.$options.methods
    if(event){
        Object.keys(event).forEach(key => {
            vm[key] = event[key].bind(vm)
        })
    }
}
function initData(vm){
    let data = vm.$options && vm.$options.data
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


const computedWatcherOptions = { lazy: true }

function initComputed(vm, computed){
    const watchers = vm._computedWatchers = Object.create(null)
    for (const key in computed) {
        const userDef = computed[key]
        const getter = typeof userDef === 'function' ? userDef : userDef.get
        watchers[key] = new Watcher(
            vm,
            getter || noop,
            noop,
            computedWatcherOptions
        )
        if (!(key in vm)) {
          defineComputed(vm, key, userDef)
        }
    }
}
function defineComputed(vm, key, userDef){    
    sharedPropertyDefinition.get = createComputedGetter(key)
    sharedPropertyDefinition.set = noop
    Object.defineProperty(vm, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
    return function computedGetter () {
        const watcher = this._computedWatchers && this._computedWatchers[key]
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate()
            }
            if (Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}

function initWatch(vm, watch){
    for (const key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
          for (let i = 0; i < handler.length; i++) {
            createWatcher(vm, key, handler[i])
          }
        } else {
          createWatcher(vm, key, handler)
        }
      }
}

function createWatcher(vm, expOrFn, handler, options){
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(expOrFn, handler, options)
}

YourVue.prototype.$watch = function (expOrFn, cb, options) {
    const vm = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
        cb.call(vm, watcher.value)

    }
    return function unwatchFn () {
      watcher.teardown()
    }
}
function isPlainObject(obj){
    Object.prototype.toString.call(obj) === '[object Object]'
}