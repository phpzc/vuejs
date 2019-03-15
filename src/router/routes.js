export default [
    {
        path:'/auth/register',
        name:'Register',
        component: () => import('@/views/auth/Register')
    },
    {
        path:'/',
        name:'Home',
        alias:'/topics',
        component: () => import('@/views/Home')
    },
    {
        path:'*',
        redirect:'/'
    },
    {
        path:'/auth/login',
        name:'Login',
        component: () => import('@/views/auth/Login')
    },

    {
        path:'/users/1/edit',
        //name:'EditUsers',  //不需要设置名称
        component:() => import('@/views/users/Edit.vue'),
        children:[
            {  //当前路由的默认子路由
                path:'',
                name:'EditProfile',
                component: ()=> import('@/views/users/Profile.vue'),
                meta: { auth:true }
            },
            {
                path:'/users/1/edit_avatar',
                name:'EditAvatar',
                component: ()=> import('@/views/users/Avatar.vue'),
                meta:{ auth:true}
            },
            {
                path:'/users/1/edit_password',
                name:'EditPassword',
                component: ()=> import('@/views/users/Password.vue'),
                meta:{ auth:true}
            }
        ]
    },
    //Article Create
    {
        path:'/articles/create',
        name:'Create',
        component:()=>import('@/views/articles/Create'),
        meta:{ auth:true}
    },
    // {
    //     path:'/articles/:articleId/content',
    //     name:'Content',
    //     component: ()=> import('@/views/articles/Content.vue')
    //
    // },
    {
        path:'/articles/:articleId/edit',
        name:'Edit',
        component: () => import('@/views/articles/Create'),
        meta: { auth:true}
    },
    {
        path:'/:user',
        //name:'Column',
        component: ()=> import('@/views/articles/Column'),
        children: [
            {
                path:'',
                name:'Column',
                component: ()=>import('@/views/articles/List.vue')
            },
            {
                path:'/articles/:articleId/content',
                name:'Content',
                component: ()=> import('@/views/articles/Content.vue')
            }
        ]
    }
]