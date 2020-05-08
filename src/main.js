import YourVue from './instance/instance'
import Vue from 'vue'

  const helloWorld = {
    data: {
        count: 0,
        items:[1,2,3,0,5],
        flag: true
    },
    props:['message'],
    template: `
        <div>
          items: {{this.items}}
            <slot name="head"></slot>
            <slot></slot>
            <div v-for="item in items">
              <p>{{item}}</p>
            </div>
            <button @click="addCount">child button click:{{count}}</button>
            <div v-if="flag">watch count v-if flag</div>
            <div style="color: red">parent message: {{countMessage}}</div>
        </div>
    `,
    watch:{
      count: function (newMes, oldMes) {
          this.flag = !this.flag
      }
    },
    computed:{
      countMessage: function () {
        return this.message + this.count
      }
    },
    methods:{
        addCount(){
          this.count += 1
          this.$emit('select',this.count)
          this.items.push(this.count)
        }
    }
  }
   //eslint-disable-next-line no-debugger
  //  debugger
  
new YourVue({
  el: '#app',
  components:{ helloWorld },
  data:{ message:'parent message' },
  template: `
    <div>
      <hello-world :message="message" @select="parentHandler">
          <p slot="head">slot head</p>
          <p>slot default</p>
          <p>slot default2</p>
          <p slot="foot">slot foot</p>
      </hello-world>
      <button @click="change">change parent message</button>
    </div>
  `,
  methods:{
    change(){
      this.message += 'change'
    },
    parentHandler(value){
      console.log('parentHandler', value)
    }
  }
})

