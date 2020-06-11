import YourVue from './instance/instance'

const helloWorld = {
  data: {
      count: 0,
      items:[1,2,3,0,5],
      flag: true
  },
  props:['message'],
  template: `
      <div>
          array: {{items}}
          <div v-if="flag">watch count as v-if flag</div>
          <div v-for="item in items">
            <p>{{item}}</p>
          </div>
          <button @click="addCount">addCount & clickTimes:{{count}}</button>
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

new YourVue({
  el: '#app',
  components:{ helloWorld },
  data:{ message:'parent message' },
  template: `
    <div>
      <hello-world :message="message" @select="parentHandler"></hello-world>
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

