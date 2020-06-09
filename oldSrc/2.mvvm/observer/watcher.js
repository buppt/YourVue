
import { pushTarget, popTarget } from './dep'
export class Watcher{
    constructor(vm, expOrFn, cb){
        this.cb = cb;
        this.vm = vm;
        this.getter = expOrFn
        this.deps = []
        this.newDeps = []
        this.depIds = new Set()
        this.newDepIds = new Set()
        this.value = this.get();

    }
    update(){
        this.run();
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
        const vm = this.vm
        const value = this.getter.call(vm, vm)
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
}