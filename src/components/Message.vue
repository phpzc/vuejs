<template>
    <div v-show="show" :class="`alert alert-${type} alert-dismissible`">
        <button @click="close" type="button" class="close"><span>x</span></button>
        {{ msg }}
    </div>
</template>

<script>
    export default {
        name: "Message",

        // 传递数据的  声明预期的数据  父组件 可以给其 传值
        //props 是单向绑定的  父组件添加 .sync 修饰符以创建双向绑定
        // <Message :show.sync="msgShow"/>
        // 它会被Vue扩展为
        // <Message :show="msgShow" @update:show="val => msgShow = val" />
        // 因为有 update:show 事件监听 所以我们close方法内部 使用emit来关闭消息提示 通过触发这个事件 修改show的值 
        props:{
            //是否显示消息框
            show: {
                type: Boolean,
                default: false
            },
            //消息的类型
            type: {
                type: String,
                default:'success'
            },
            msg:{
                type:String,
                default:''
            }
        },
        //侦听器
        watch: {

            //监听的是 show的新值
            show(value) {
                if(value) {
                    //true时 滚动到可视区域顶部
                    this.$nextTick( () => {
                        this.$el.scrollIntoView(true)
                    })
                }
            }
        },

        methods: {
            close() {
                //触发一个事件   事件名称  若干参数
                // 不可以直接修改 show  触发一个事件 来更新show
                this.$emit('update:show', false)
            }
        }
    }
</script>

<style scoped>

</style>
