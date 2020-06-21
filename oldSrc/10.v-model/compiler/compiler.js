import { generate }from './codegen'

const vueCompiler = require('./vueCompiler')

const parse = vueCompiler.parse

export function templateToCode(template){
    const ast = parse(template, {})
    return generate(ast)
}