import { Dep } from './dep'
import { def, arrayMethods } from './array'
class Observer{
    constructor(value) {
        this.value = value
        this.dep = new Dep()
        def(value, '__ob__', this)
        if(Array.isArray(value)){
            value.__proto__ = arrayMethods
            this.observeArray(value)
        }else{
            this.walk(value);
        }
    }
    walk(value) {
        Object.keys(value).forEach(function(key) {
            defineReactive(value, key, value[key]);
        });
    }
    observeArray(value){
        value.forEach(item => {
            observe(item)
        })
    }
}

export function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}

function defineReactive(value, key, val) {
    const dep = new Dep();
    let childOb = observe(val);
    console.log(childOb);
    
    Object.defineProperty(value, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend()
                }
            }
            return val;
        },
        set: function(newVal) {
            if (newVal === val) {
                return;
            }
            val = newVal;
            dep.notify();
        }
    });
}
