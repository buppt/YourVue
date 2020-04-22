import YourVue from './instance'
import { VNode } from './vdom/vnode'

const vueCompiler = require('./vueCompiler')

const parse = vueCompiler.parse

export function templateToVnode(template, vm){
    const ast = parse(template, {})
    console.log(ast);
    
    const root = createDom(ast, vm)
    console.log(root);
    
    return root
}

function createDom(ast, vm){
    if(ast.type === 1){
        if(isHTMLtag(ast.tag)){
            const children = []
            ast.children.forEach(e => {
                const child = createDom(e, vm)
                if(child){
                    children.push(child)
                }
            })
            if(children.length===1 && typeof children[0] === 'string'){
                return new VNode(ast.tag, genProps(ast.attrsMap, vm), [], children[0], undefined, vm)
            }
            return new VNode(ast.tag, genProps(ast.attrsMap, vm), children, undefined, undefined, vm)
        }else{
            return componentToVNode(ast, vm)
        }
    }else if(ast.type === 3 && ast.text.trim()){
        return ast.text
    }else if(ast.type === 2){
        let res = ''
        ast.tokens.forEach(item => {
            if(typeof item === 'string'){
                res += item
            }else if(typeof item === 'object'){
                res += vm[item['@binding']]
            }
        })
        return res
    }else {
        return ''
    }
}

function genProps(attrsMap, vm){
    const on = {}
    const res = { on }
    Object.keys(attrsMap).forEach(attr => {
        if(attr[0] === '@'){
            on[attr.substring(1)] = vm[attrsMap[attr]].bind(vm)
        }else if(attr[0] === ':') {
            res[attr.substring(1)] = vm[attrsMap[attr]]
        }else{
            res[attr] = attrsMap[attr]
        }
    })
    return res
}


function isHTMLtag(tag){
    let str = 'template,script,style,element,content,slot,link,meta,svg,view,' +
        'a,div,img,image,text,span,input,switch,textarea,spinner,select,button,h1,h2,h3,h4,h5,h6' +
        'slider,slider-neighbor,indicator,canvas,' +
        'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
        'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown'
    return str.split(',').includes(tag)
}

function componentToVNode(ast, vm){
    let tag = ast.tag
    console.log('compontent', tag);
    
    if(tag.includes('-')){
        tag = toHump(tag)
    }
    const Ctor = YourVue.extend(vm.$options.components[tag])
    const name = tag
    const data = genProps(ast.attrsMap, vm)
    data.hooks = {
        init(vnode){
            const child = vnode.componentInstance = new vnode.componentOptions.Ctor({
                _isComponent: true,
                _parentVnode: vnode
                })
            child.$mount()
        }
    }
    const vnode = new VNode(
        `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
        data, undefined, undefined, undefined, vm,
        { Ctor, tag }
    )
    console.log('vnode',vnode);
    
    return vnode
}

function toHump(name) {
    return name.replace(/-(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}