import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path:'/auth/register',
        name:'Register',
        //使用下面的方法指定组件，可以实现路由懒加载，
        // 即当路由被访问时才加载对应的组件
        component: () => import('@/views/auth/Register')
    },

    //首页路由配置
    {
        path:'/',
        name:'Home',
        component: () => import('@/views/Home')
    },

    //其他未配置的路由 都跳转到首页
    {
        path:'*',
        //重定向
        redirect:'/'
    }


]


const router = new Router({

    //mode：路由模式，默认值 'hash' 使用井号（ # ）作路由，
    // 值 'history' 可利用 History API 来完成页面跳转且无须重新加载；
    mode:'history',
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
    const auth = router.app.$options.store.state.auth

    if ( auth && to.path.indexOf('/auth/') !== -1) {
        //如果当前用户已登录 且目标路由包含 /auth/，就跳转到首页
        next('/')
    }else{
        next()
    }
})

export default router
