
import {pushTarget, popTarget} from './dep'
import {nextTick} from '../instance/next-tick'
let uid = 0
export class Watcher{
    constructor(vm, expOrFn, cb, options){
        this.cb = cb;
        this.vm = vm;
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()
        if (options) {
            this.deep = !!options.deep
            this.user = !!options.user
            this.lazy = !!options.lazy
            this.sync = !!options.sync
            this.before = options.before
        } else {
            this.deep = this.user = this.lazy = this.sync = false
        }
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else {
            const segments = expOrFn.split('.')
            this.getter = function (obj) {
                for (let i = 0; i < segments.length; i++) {
                    if (!obj) return
                        obj = obj[segments[i]]
                    }
                return obj
            }
        }
        this.dirty = this.lazy
        this.value = this.lazy
            ? undefined
            : this.get()
        this.id = ++uid
    }
    update(){
        if (this.lazy) {
            this.dirty = true
        } else if (this.sync) {
            this.run()
        } else {
            queueWatcher(this)
        }
    }
    run(){
        const value = this.get()
        if (value !== this.value) {
            const oldValue = this.value
            this.value = value;
            this.cb.call(this.vm, value, oldValue);
        }
    }
    get(){
        pushTarget(this)
        let value
        const vm = this.vm
        try {
            value = this.getter.call(vm, vm)
        } catch (e) {
            console.log(e)
        }
        popTarget()
        this.cleanupDeps()
        return value;
    }
    addDep (dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                dep.addSub(this)
            }
        }
    }
    cleanupDeps () {
        let i = this.deps.length
        while (i--) {
          const dep = this.deps[i]
          if (!this.newDepIds.has(dep.id)) {
            dep.removeSub(this)
          }
        }
        let tmp = this.depIds
        this.depIds = this.newDepIds
        this.newDepIds = tmp
        this.newDepIds.clear()
        tmp = this.deps
        this.deps = this.newDeps
        this.newDeps = tmp
        this.newDeps.length = 0
    }
    evaluate () {
        this.value = this.get()
        this.dirty = false
    }
    depend () {
        let i = this.deps.length
        while (i--) {
          this.deps[i].depend()
        }
      }
    teardown () {
        if (this.active) {
            if (!this.vm._isBeingDestroyed) {
            const arr = this.vm._watchers
            if (arr.length) {
                const index = arr.indexOf(this)
                if (index > -1) {
                    arr.splice(index, 1)
                }
                }
            }
            let i = this.deps.length
            while (i--) {
                this.deps[i].removeSub(this)
            }
            this.active = false
        }
    }
}

const queue = []
let has = {}
let waiting = false
let flushing = false
let index = 0

function queueWatcher(watcher){
    const id = watcher.id
    if (has[id] == null) {
        has[id] = true
        if (!flushing) {
            queue.push(watcher)
          } else {
            let i = queue.length - 1
            while (i > index && queue[i].id > watcher.id) {
              i--
            }
            queue.splice(i + 1, 0, watcher)
          }
    }
    if (!waiting) {
        waiting = true
        nextTick(flushSchedulerQueue)
    }
}

function flushSchedulerQueue(){
    flushing = true
    queue.sort((a, b) => a.id - b.id)
    for (index = 0; index < queue.length; index++) {
        const watcher = queue[index]
        const id = watcher.id
        has[id] = null
        watcher.run()
    }
    resetSchedulerState()
}

function resetSchedulerState () {
    index = queue.length = 0
    has = {}
    waiting = flushing = false
  }