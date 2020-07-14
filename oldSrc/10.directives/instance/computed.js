import {noop, sharedPropertyDefinition} from './instance'
import { Watcher } from '../observer/watcher'
import { Dep } from '../observer/dep'

const computedWatcherOptions = { lazy: true }

export function initComputed(vm, computed){
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