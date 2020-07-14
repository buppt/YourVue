module.exports = {
    devServer: {
        "port": 3000,
        "open": true
    },
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'development', config => {
            // use src code
            config.entry('app').clear().add('./src/main.js')     
            // use old code
            // config.entry('app').clear().add('./oldSrc/1.main_flow/main.js')
            // config.entry('app').clear().add('./oldSrc/2.mvvm/main.js')
            // config.entry('app').clear().add('./oldSrc/3.array_observe/main.js')
            // config.entry('app').clear().add('./oldSrc/4.vdom/main.js')
            // config.entry('app').clear().add('./oldSrc/5.components&props/main.js')
            // config.entry('app').clear().add('./oldSrc/6.if&for/main.js')
            // config.entry('app').clear().add('./oldSrc/7.watch&computed&nextTick/main.js')
            // config.entry('app').clear().add('./oldSrc/8.event/main.js')
            // config.entry('app').clear().add('./oldSrc/9.slot/main.js')
            // config.entry('app').clear().add('./oldSrc/10.directives/main.js')
        })
    }
}