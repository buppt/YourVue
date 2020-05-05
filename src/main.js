import YourVue from './instance/instance'
import Vue from 'vue'

const helloWorld = {
    data: {
        count: 0,
        message: 'message',
        array: [],
        watchMes: ''
    },
    template: `
        <div>
            <div>{{count}} : {{message}}</div>
            <button @click="addCount" class="test">addCount</button>
            <h2 style="color: red">{{reversedMessage}}</h2>
            <button @click="decCount">decCount</button>
            <h3>{{array}}{{watchMes}}</h3>
        </div>
    `,
    computed: {
      reversedMessage: function () {
        return this.message.split('').reverse().join('')
      }
    },
    watch: {
      message: function (newMes, oldMes) {
        this.watchMes = newMes
      }
    },
    methods:{
        addCount(){
          this.count += 1
          this.array.push(0)
          this.message += this.count
        },
        decCount(){
            this.count -= 1
            if(this.array.length){
                this.array.pop()
            }
        }
    },
    created(){
      console.log('created')
    },
    mounted(){
      console.log('mounted',this.count)
    },
    beforeUpdate(){
      console.log('beforeUpdate');
    },
    updated(){
      console.log('updated')
    }
  }

  const helloWorld2 = {
    data: {
        count: 0,
    },
    props:['message'],
    template: `
        <div>
            <div style="color: green">{{count}}:{{message}}</div>
            <button @click="addCount" class="test">addCount</button>
            <slot name="head"></slot>
            <slot></slot>
        </div>
    `,
    methods:{
        addCount(){
          this.count += 1
          this.$emit('select',this.count)
        }
    }
  }
   //eslint-disable-next-line no-debugger
  //  debugger
  
new YourVue({
  el: '#app',
  components:{ helloWorld, helloWorld2 },
  data:{ message:'parent' },
  template: `<div>
      <hello-world :message="message"></hello-world>
      <hello-world2 :message="message" @select="parentHandler">
          <p slot="head">head</p>
          <p>slot test</p>
          <p slot="foot">foot</p>
      </hello-world2>
      <button @click="change">change parent</button>
    </div>
  `,
  methods:{
    change(){
      this.message += 'change'
    },
    parentHandler(value){
      console.log('parentHandler', value)
    }
  },
  created(){
    console.log('1created')
  },
  mounted(){
    console.log('1mounted',this.count)
  },
  beforeUpdate(){
    console.log('1beforeUpdate');
  },
  updated(){
    console.log('1updated')
  }
})

