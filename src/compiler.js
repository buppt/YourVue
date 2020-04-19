
const parse = require('./vueCompiler').parse
export function templateToDom(template, app){
    const ast = parse(template, {})
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
        handleEvent(ast, root, app)
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

function handleEvent(ast, root, app){
    Object.keys(ast.attrsMap).forEach(key => {
        if(key.includes(':on')){
            root.addEventListener(key.substring(3), app[ast.attrsMap[key]].bind(app))
        }
    })
}