let uid = 0
export class Dep {
    constructor(){
        this.id = uid++
        this.subs = []
    }
    addSub (sub){
        this.subs.push(sub);
    }
    notify() {
        this.subs.forEach(sub => sub.update());
    }
    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
}

Dep.target = null
const targetStack = []

export function pushTarget (_target) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
