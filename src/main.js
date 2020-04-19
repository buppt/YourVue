import YourVue from './instance'

new YourVue({
  el: '#app',
  data: {
      count: 0,
      message: 'message',
      log:1
  },
  template: `
      <div>
          <div>{{count}} : {{message}}</div>
          <button :onclick="addCount" class="test">addCount</button>
          <h2>{{message}}</h2>
          <button :onclick="decCount">decCount</button>
      </div>
  `,
  methods:{
      addCount(){
          const count = this.count + 1
          this.setState({
              count
          })
      },
      decCount(){
        const count = this.count - 1
        this.setState({
            count
        })
      }
  }
})
