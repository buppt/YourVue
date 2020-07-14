export function initEvent(vm){
    vm._events = Object.create(null)
    vm._hasHookEvent = false

    const listeners = vm._parentListeners
    if (listeners) {
        updateComponentListeners(vm, listeners)
    }
}

export function initMethod(vm){
    const event = vm.$options && vm.$options.methods
    if(event){
        Object.keys(event).forEach(key => {
            vm[key] = event[key].bind(vm)
        })
    }
}

function updateComponentListeners(vm, on, oldOn={}){
    for (let name in on) {
        let cur = on[name]
        let old = oldOn[name]
        if(!old){
          vm.$on(name, cur)
        }else if(event !== old){
            vm.$off(name, old)
            vm.$on(name, cur)
        }
    }
    for (let name in oldOn) {
        if (!on[name]) {
            vm.$off(name, oldOn[name])
        }
    }
}

export function eventsMixin(Vue){
  Vue.prototype.$on = function (event, fn) {
    const vm = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
    }
    return vm
  }

  Vue.prototype.$off = function (event, fn) {
    const vm = this
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    if (fn) {
      let cb
      let i = cbs.length
      while (i--) {
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }

  Vue.prototype.$emit = function (event, ...args) {
    const vm = this
    let cbs = vm._events[event]
    if (cbs) {
      for (let i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(vm, args)
      }
    }
    return vm
  }
}