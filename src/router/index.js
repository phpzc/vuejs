import Vue from 'vue'
import Router from 'vue-router'

//引入自定义路由数据数组文件
import routes from './routes'

Vue.use(Router)


const router = new Router({

    //mode：路由模式，默认值 'hash' 使用井号（ # ）作路由，
    // 值 'history' 可利用 History API 来完成页面跳转且无须重新加载；
    mode:'history',
    //linkExactActiveClass 的值是一个类名，用来添加到与当前路由对应的 <router-link> 上，以显示当前精确激活的 <router-link>，其默认值是 'router-link-exact-active'，我们这里改为 'active' 以利用 Bootstrap 的激活样式。
    linkExactActiveClass:'active',

    //指定滚动行为
    scrollBehavior(to, from, savedPosition) {
        if(to.hash){
            //有锚点时 滚动到锚点
            return {selector: to.hash}
        }else if(savedPosition) {
            //有保存位置时 滚动到保存的位置
            return savedPosition
        }else{
            //默认滚动到页面顶部
            return {x:0,y:0}
        }
    },


    //routes：具体的路由配置列表，用到的配置项说明：
    // path：路由的路径；
    // name：路由的名称；
    // component：对应的视图组件；
    routes
})


//全局前置守卫
router.beforeEach((to,from,next) => {
    //获取仓库里的 登录信息
    // 使用 router.app 可以获取 router 对应的 Vue 根实例，使用实例的 $options.store 可以从选项中访问仓库；实例的 $options 是用于当前 Vue 实例的初始化选项：
    const app = router.app
    const store = app.$options.store
    const auth = store.state.auth
    //const auth = router.app.$options.store.state.auth

    //获取articleId
    const articleId = to.params.articleId
    //当前用户
    const user = store.state.user && store.state.user.name
    //路由参数中的用户
    const paramUser = to.params.user

    app.$message.hide()

    if (
        ( auth && to.path.indexOf('/auth/') !== -1) ||
        (!auth && to.meta.auth) ||
        //有articleId 且不能找到时 跳转首页
        (articleId && !store.getters.getArticleById(articleId)) ||
        //路由参数中的用户不为当前用户，且找不到与其对应的文章时，跳转到首页    这里只是简单地通过文章的数量，来判断一个用户是否存在
        (paramUser && paramUser !== user && !store.getters.getArticlesByUid(null, paramUser).length )
    ) {
        //如果当前用户已登录 且目标路由包含 /auth/，就跳转到首页
        next('/')
    }else{
        next()
    }
})

//注册全局后置钩子
router.afterEach( (to,from) => {
    const app = router.app
    const store = app.$options.store
    const showMsg = to.params.showMsg

    if(showMsg) {

        if( typeof showMsg === 'string') {
            app.$message.show(showMsg)
        }else{
            app.$message.show('操作成功')
        }

    }
})

export default router
