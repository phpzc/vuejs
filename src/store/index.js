import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'

import * as moreActinos from './actions'
import * as moreGetters from './getters'


Vue.use(Vuex)

const state = {
    user: ls.getItem('user'),

    //添加auth 来保存当前用户的登录状态
    auth: ls.getItem('auth'),

    //
    articles: ls.getItem('articles')
}

const mutations = {

    // state 是当前仓库Store的 state
    UPDATE_USER(state, user) {
        state.user = user
        ls.setItem('user',user)
    },

    UPDATE_AUTH(state, auth) {
        state.auth = auth
        ls.setItem('auth',auth)
    },

    UPDATE_ARTICLES(state,articles) {
        state.articles = articles
        ls.setItem('articles',articles)
    }
}

const actions = {

    // { commit} 写法 是参数解构写法  用到这个参数里面的 commit属性 commit就代表这个对应的方法

    login( { commit }, user) {

        // 登录时有传用户信息，就更新下用户信息
        if(user) commit('UPDATE_USER',user)

        //更新用户的登录状态
        commit('UPDATE_AUTH', true)

        //跳转首页
        router.push('/')
    },

    logout({ commit }){
        commit('UPDATE_AUTH', false)

        router.push({name:'Home', params: {logout: true} })
    },

    //写法2
    // login(context, user) {
    //     if (user) context.commit('UPDATE_USER', user)
    //     router.push('/')
    // }


    /**
     *
     // 字符串
     router.push('/')

     //  含路径的对象
     router.push({ path: '/' })

     //  含命名的对象
     router.push({ name: 'Home' })

     //  含参数和查询参数的对象
     router.push({ params: { id: 1 }, query: { page: 1 } })

     //当 <router-link> 被点击后，to 的值就会传到 router.push()，所以 to 的值有以下相应的写法：

     <!-- 字符串 -->
     <router-link to="/">Home</router-link>

     <!-- 含路径的对象 -->
     <router-link :to="{ path: '/' }">Home</router-link>

     <!-- 含命名的对象 -->
     <router-link :to="{ name: 'Home' }">Home</router-link>

     <!-- 含参数和查询参数的对象 -->
     <router-link :to="{ params: { id: 1 }, query: { page: 1 } }">Home</router-link>


     */



    //更新个人信息
    updateUser( { state, commit} , user ) {
        const stateUser = state.user

        if( stateUser &&  typeof stateUser === 'object' ) {
            user = { ...stateUser, ...user}

        }

        commit('UPDATE_USER',user)
    },
    ...moreActinos
}

const getters = {
    getArticleById: (state, getters) => (id) => {

        //let articles = state.articles
        //使用派生状态 computedArticles作为所有文章
        let articles = getters.computedArticles

        if(Array.isArray(articles)) {
            articles = articles.filter( article => parseInt(id) === parseInt(article.articleId) )
            return articles.length ? articles[0]:null
        }else{
            return null
        }
    },
    //混入moreGetters 你可以理解为 getters = Object.assign(getters, moreGetters)
    ...moreGetters
}


const store = new Vuex.Store({
    //共享的状态
    state,
    //注册getters
    getters,

    //更改 状态的方法 我们可以在这里更改状态，调用方法是像 store.commit('UPDATE_USER', user) 这样提交一个事件类型，这里不能包含异步操作；
    mutations,

    // 类似于 mutations，但我们不在这里直接更改状态，而是提交前面的 mutation，调用方法是像 store.dispatch('login') 这样分发一个事件，这里可以包含异步操作
    actions

})

export default store
