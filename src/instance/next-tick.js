const callbacks = []
let pending = false
let timerFunc


export function nextTick (cb, ctx) {
    let _resolve
    callbacks.push(() => {
      if (cb) {
        cb.call(ctx)
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      setImmediate(flushCallbacks)
    }

    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(resolve => {
        _resolve = resolve
      })
    }
  }
  
  function flushCallbacks () {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }