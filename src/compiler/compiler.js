import {generate}from './codegen'

const vueCompiler = require('./vueCompiler')

const parse = vueCompiler.parse
const generate2 = vueCompiler.generate

export function templateToCode(template){
    const ast = parse(template, {})
    return generate(ast)
}