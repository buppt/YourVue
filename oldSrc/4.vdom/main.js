import YourVue from './instance/instance'

new YourVue({
  el: '#app',
  data: {
      count: 0,
      message: 'message',
      items: [1,2,3,0,5]
  },
  template: `
      <div>
          array: {{items}}
          <div>{{count}}</div>
          <button @click="addCount">addCount</button>
          <h4 style="color: red">{{message}}</h4>
          <button @click="decCount">decCount</button>
      </div>
  `,
  methods:{
    addCount(){
        this.count += 1
        this.items.push(this.count)
    },
    decCount(){
        this.count -= 1
        this.items.pop()
    }
  }
})
