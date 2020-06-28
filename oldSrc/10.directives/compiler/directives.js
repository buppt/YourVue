
export function bind (el, dir) {
    el.wrapData = (code) => {
        return `_b(${code},'${el.tag}',${dir.value},${
        dir.modifiers && dir.modifiers.prop ? 'true' : 'false'
        }${
        dir.modifiers && dir.modifiers.sync ? ',true' : ''
        })`
    }
}

function on (el, dir) {
    el.wrapListeners = (code) => `_g(${code},${dir.value})`
}

function model(el ,dir){
    const value = dir.value
    const modifiers = dir.modifiers
    const tag = el.tag
    const type = el.attrsMap.type
    // if (el.component) {
    //     genComponentModel(el, value, modifiers)
    //     return false
    // } else if (tag === 'select') {
    //     genSelect(el, value, modifiers)
    // } else if (tag === 'input' && type === 'checkbox') {
    //     genCheckboxModel(el, value, modifiers)
    // } else if (tag === 'input' && type === 'radio') {
    //     genRadioModel(el, value, modifiers)
    // } else 
    if (tag === 'input' || tag === 'textarea') {
        genDefaultModel(el, value, modifiers)
    // } else if (!config.isReservedTag(tag)) {
    //     genComponentModel(el, value, modifiers)
    //     return false
    }

    // ensure runtime directive metadata
    return true
}
function genDefaultModel (el, value, modifiers) {
    const type = el.attrsMap.type
    const { lazy, number, trim } = modifiers || {}
    const needCompositionGuard = !lazy && type !== 'range'
    const event = lazy
      ? 'change'
      : type === 'range'
        ? '__r'
        : 'input'
  
    let valueExpression = '$event.target.value'
    if (trim) {
      valueExpression = `$event.target.value.trim()`
    }
    if (number) {
      valueExpression = `_n(${valueExpression})`
    }
  
    let code = `${value}=${valueExpression}`
    if (needCompositionGuard) {
      code = `function($event){if($event.target.composing)return;${code}}`
    }
  
    addProp(el, 'value', `(${value})`)
    addHandler(el, event, code, null, true)
}

export function addProp (el, name, value, range, dynamic) {
    (el.props || (el.props = [])).push(rangeSetItem({ name, value, dynamic }, range))
    el.plain = false
}
function rangeSetItem (
    item,
    range
  ) {
    if (range) {
      if (range.start != null) {
        item.start = range.start
      }
      if (range.end != null) {
        item.end = range.end
      }
    }
    return item
}

function addHandler (
    el,
    name,
    value,
    modifiers,
    important,
    warn,
    range,
    dynamic
  ) {

    var events;

    events = el.events || (el.events = {});

    var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);

    var handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }
  
    el.plain = false;
}
export function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', `_s(${dir.value})`, dir)
  }
}
function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', `_s(${dir.value})`, dir)
  }
}

export default {
    on,
    bind,
    model,
    html,
    text
}