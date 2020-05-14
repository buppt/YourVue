import Vue from 'vue'
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
        const children = []
        ast.children.forEach(e => {
            const child = createDom(e, vm)
            if(child){
                children.push(child)
            }
        })
        if(children.length===1 && typeof children[0] === 'string'){
            return new VNode(ast.tag, genProps(ast.attrsMap, vm), [], children[0], undefined, undefined)
        }
        return new VNode(ast.tag, genProps(ast.attrsMap, vm), children, undefined, undefined, undefined)
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