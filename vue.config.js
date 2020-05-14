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
        })
    }
}