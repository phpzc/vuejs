//message插件
import MessageComponent from '../components/Message'

export default  {
    install: (Vue) => {
        //创建一个新子类
        const Message = Vue.extend(MessageComponent)
        const vm = new Message()
        //手动挂载一个未挂载的实例 返回这个实例
        const $el = vm.$mount().$el

        //
        console.log( $el)

        Vue.nextTick( ()=>{
            document.querySelector('#main-container').prepend($el)
        })

        vm.$on('update:show', (value) => {
            vm.show = value
        })

        const message = {

            show(msg = '', type = 'success') {
                vm.msg = msg
                vm.type = type
                vm.show = false

                Vue.nextTick( ()=> {
                    vm.show = true
                })
            },
            hide() {
                Vue.nextTick( ()=>{
                    vm.show = false
                })
            }
        }

        Vue.prototype.$message = message
    }
}