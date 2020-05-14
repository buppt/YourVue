import YourVue from './instance'
import Vue from 'vue'

const helloWorld = {
    data: {
        count: 0,
        message: 'message',
        array: []
    },
    template: `
        <div>
            <div>{{count}} : {{message}}</div>
            <button @click="addCount" class="test">addCount</button>
            <h2 style="color: red">{{message}}</h2>
            <button @click="decCount">decCount</button>
            <h3>{{array}}</h3>
        </div>
    `,
    methods:{
        addCount(){
          this.count += 1
          this.array.push(0)
        },
        decCount(){
            this.count -= 1
            if(this.array.length){
                this.array.pop()
            }
        }
    }
  }

  const helloWorld2 = {
    data: {
        count: 0,
    },
    template: `
        <div>
            <div style="color: green">{{count}}</div>
            <button @click="addCount" class="test">addCount</button>
        </div>
    `,
    methods:{
        addCount(){
          this.count += 1
        }
    }
  }
new YourVue({
  el: '#app',
  components:{ helloWorld, helloWorld2 },
  template: `<div>
      <hello-world :message="message"></hello-world>
      <hello-world2 :message="message"></hello-world2>
    <div>
  `,
})

