# YourVue

学习 vue 源码的最好方法，就是自己实现一个 vue !

本项目旨在实现 vue 的主流程，理解 vue 主流程中的细节，省去额外的代码方便查看与学习。

- [x] new YourVue
- [x] compiler
- [x] observer
- [x] vdom
- [x] component
- [x] lifecycle
- [x] next-tick
- [x] props
- [x] watch computed

为了使流程看起来简洁， compiler 只用了 vue 的 parse，没有用 gencode 和 render 函数，所以前面有些地方的实现和 vue 不太一样。

这也导致后面的内容没有办法和 vue 使用相同的方法实现了。

不过目前为止 vue 的关键流程都已经实现。

- [x] event 没有完全实现
- [ ] v-model
- [ ] slot
- [ ] v-if v-for ...
- [ ] vue-router
- [ ] vuex

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve 
or
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
