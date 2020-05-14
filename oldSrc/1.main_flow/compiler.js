
export function templateToDom(template, app){
    const ast = parse(template, app)
    const root = createDom(ast, app)
    return root
}
function parse(template, app){
    return {
        tag: 'div',
        children: [{
            tag: 'div',
            textContent: `${app.count}`
        },{
            tag: 'button',
            textContent: 'button',
            events:{
                click: 'addCount'
            }
        }]
    }
}
function createDom(ast, app){
    let root = document.createElement(ast.tag)
    if(ast.textContent){
        root.textContent = ast.textContent
    }
    if(ast.children){
        ast.children.forEach(child => {
            root.appendChild(createDom(child, app))
        })
    }
    if(ast.events){
        Object.keys(ast.events).forEach(event => {
            root.addEventListener(event, app[ast.events[event]].bind(app))
        })
    }
    return root
}