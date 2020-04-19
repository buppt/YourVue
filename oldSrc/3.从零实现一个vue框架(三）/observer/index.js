import {Dep} from './dep'
class Observer{
    constructor(data) {
        this.data = data;
        if(Array.isArray(data)){
            observeArray(data)
        }else{
            this.walk(data);
        }
    }
    walk(data) {
        Object.keys(data).forEach(function(key) {
            defineReactive(data, key, data[key]);
        });
    }
    
}

export function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}

function defineReactive(data, key, val) {
    const dep = new Dep();
    let childOb = observe(val);
    Object.defineProperty(data, key, {
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

function observeArray(data){
    data.forEach(item => {
        observe(item)
    })
}