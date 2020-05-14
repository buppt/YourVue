import YourVue from './instance'

new YourVue({
  el: '#app',
  data: {
      count: 0
  },
  template: `
      <div>
          <div>{{data.count}}</div>
          <button :onclick="addCount">button</button>
      </div>
  `,
  methods:{
      addCount(){
          const count = this.count + 1
          this.setState({
              count
          })
      }
  }
})
