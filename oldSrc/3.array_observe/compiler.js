const vueCompiler = require('./vueCompiler')

const parse = vueCompiler.parse

export function templateToDom(template, app){
    const ast = parse(template, app)
    const root = createDom(ast, app)
    return root
}

function createDom(ast, app){
    if(ast.type === 1){
        const root = document.createElement(ast.tag)
        ast.children.forEach(child => {
            child.parent = root
            createDom(child, app)
        })
        if(ast.parent){
            ast.parent.appendChild(root)
        }
        if(ast.events){
            updateListeners(root, ast.events, {}, app)
        }
        return root
    }else if(ast.type === 3 && ast.text.trim()){
        ast.parent.textContent = ast.text
    }else if(ast.type === 2){
        let res = ''
        ast.tokens.forEach(item => {
            if(typeof item === 'string'){
                res += item
            }else if(typeof item === 'object'){
                res += app[item['@binding']]
            }
        })
        ast.parent.textContent = res
    }
}


function updateListeners(elm, on, oldOn, context){
    for (let name in on) {
        let cur = context[on[name].value]
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

function isDef (v) {
    return v !== undefined && v !== null && v != []
}

function isUndef(v){
    return v === undefined || v === null || v === ''
}