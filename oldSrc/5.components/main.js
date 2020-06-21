import YourVue from './instance/instance'

const helloWorld = {
    data: {
        count: 0,
        items:[1,2,3,0,5],
    },
    props:['message'],
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
  }
  
new YourVue({
    el: '#app',
    components:{ helloWorld },
    data:{
        message: "parentMessage"
    },
    template: `
      <div>
        <hello-world :message="message"></hello-world>
        <button @click="change">parent button</button>
      </div>
    `,
    methods:{
        change(){
            this.message = this.message.split('').reverse().join('')
        }
    }
})