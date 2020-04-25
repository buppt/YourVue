import { VNode } from './vnode'
export function patch (oldVnode, vnode, el) {
  //eslint-disable-next-line no-debugger
                // debugger
  if(isUndef(vnode)){
      createElm(oldVnode, el)
      return
  }
  if (oldVnode === vnode) {
      return 
  }
  
  if(sameVnode(oldVnode, vnode)){
        patchVnode(oldVnode, vnode)
  }else{
      const parentElm = oldVnode.elm.parentNode;
      createElm(vnode,parentElm,oldVnode.elm)
      removeVnodes(parentElm,[oldVnode],0,0)
  }
}
function sameVnode (a, b) {
  return (
      a.key === b.key && 
      a.tagName=== b.tagName &&
      sameInputType(a, b)
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  return a.props.type == b.props.type
}
function patchVnode(oldVnode, vnode){
  let i
  const data = vnode.props
  if (isDef(data) && isDef(i = data.hooks) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }
  const ch = vnode.children
  const oldCh = oldVnode.children
  const elm = vnode.elm = oldVnode.elm
  if(isUndef(vnode.text)){
    if(isDef(ch) && isDef(oldCh)){
        updateChildren(elm,oldCh,ch)
    }else if(isDef(ch)){
        if (isDef(oldVnode.text)) setTextContent(elm, '')
        addVnodes(oldVnode, ch, 0, ch.length - 1)
    }else if(isDef(oldCh)){
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
  }else{
      setTextContent(elm, vnode.text);
  }
}
function updateChildren(parentElm, oldCh, newCh,){
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] 
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { 
        patchVnode(oldStartVnode, newEndVnode)
        insertBefore(parentElm, oldStartVnode.elm, oldEndVnode.elm.nextSibling)
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { 
        patchVnode(oldEndVnode, newStartVnode)
        insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) {
          createElm(newStartVnode, parentElm, oldStartVnode.elm)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode)
            oldCh[idxInOld] = undefined
            insertBefore(parentElm,vnodeToMove.elm, oldStartVnode.elm)
          } else {
            createElm(newStartVnode, parentElm, oldStartVnode.elm)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, newCh, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
function findIdxInOld (node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}
function setTextContent(elm, content){
  elm.textContent = content;
}
function addVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(vnodes[startIdx], parentElm, null)
  }
}
function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (let i=startIdx; i <= endIdx; i++) {
    var ch = vnodes[i]
    if(ch){
      parentElm.removeChild(vnodes[i].elm)
    }
  }
}

function createElm (vnode, parentElm, afterElm = undefined) {
  if (createComponent(vnode, parentElm, afterElm)) {
    return
  }
  let element = document.createElement(vnode.tag)
  console.log('createElement', vnode.tag)
  
  for(let key in vnode.props){
      if(key === 'on') {
          const on = vnode.props[key] || {}
          const oldOn = {}
          updateListeners(element, vnode.props[key], oldOn, vnode.context)
      } else {
        element.setAttribute(key,vnode.props[key])
      }
  }
  for(let child of vnode.children){
      if(child instanceof VNode){
          createElm(child, element)
      }
  }
  if(vnode.text){
      element.appendChild(document.createTextNode(vnode.text))
  }
  vnode.elm = element;
  if(isDef(afterElm)){
    insertBefore(parentElm,element,afterElm)
  }else if(parentElm){
    parentElm.appendChild(element)
  }
  return element;
}


function insertBefore(parentElm,element,afterElm){
  parentElm.insertBefore(element,afterElm)
}

function isDef (v) {
  return v !== undefined && v !== null && v != []
}

function isUndef(v){
  return v === undefined || v === null || v === ''
}

function createComponent (vnode, parentElm, afterElm) {
  let i = vnode.props
  if (i) {
    if (i.hooks&&i.hooks.init) {
      i.hooks.init(vnode)
    }
    if (isDef(vnode.componentInstance)) {
      vnode.elm = vnode.componentInstance.vnode.elm
      if(isDef(afterElm)){
        insertBefore(parentElm,vnode.elm,afterElm)
      }else if(parentElm){
        parentElm.appendChild(vnode.elm)
      }
      return true
    }
  }
}

function updateListeners(elm, on, oldOn, context){
  for (let name in on) {
    let cur = on[name]
    let old = oldOn[name]
    if(isUndef(old)){
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      elm.addEventListener(name, cur)
    }else if(event !== old){
      old.fns = cur
      on[name] = old
    }
  }
  for (let name in oldOn) {
    if (isUndef(on[name])) {
      elm.removeEventListener(name, oldOn[name])
    }
  }
}

function createFnInvoker(fns){
  function invoker () {
      const fns = invoker.fns
      return fns.apply(null, arguments)
  }
  invoker.fns = fns
  return invoker
}