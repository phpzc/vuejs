<template>
    <div>
        <Message :show.sync="msgShow" :type="msgType" :msg="msg" />
    </div>
</template>

<script>
    export default {
        name: "Home",

        data() {
            return {
                msg:'',
                msgType:'',
                msgShow: false
            }
        },
        //组件内的路由导航守卫
        // to 即将要进入的路由
        // from 当前导航正要离开的路由
        // next 一个用来 resolve 当前钩子的方法，需要调用该方法来确认或者中断导航；
        beforeRouteEnter(to, from, next) {
            //路由的名称 对应路由配置中的name
            const fromName = from.name
            const logout = to.params.logout
            //确认导航
            next( vm => {

                //通过vm参数 访问组件实例 已登录时 评估路由名称
                if( vm.$store.state.auth) {
                    switch (fromName) {
                        //如果从注册页面过来
                        case 'Register':
                            //显示注册成功
                            vm.showMsg('注册成功')
                            break

                    }
                } else if (logout) {
                    vm.showMsg('操作成功')
                }
            })
        },

        computed: {
            auth() {
                return this.$store.state.auth
            }
        },

        watch: {
            //从当前页退出时 监听auth  beforeRouteEnter不会被触发
            auth(value) {
                if(!value) {
                    this.showMsg('操作成功')
                }
            }
        },
        methods: {
            showMsg(msg, type = 'success') {
                this.msg = msg
                this.msgType = type
                this.msgShow = true
            }
        }

    }
</script>

<style scoped>

</style>
