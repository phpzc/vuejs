// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//引入路由
import router from './router'
//引入全局验证指令  导入了 ./directives/index.js
import './directives'
//引入全局消息组件
import './components'

//引入store/index.js的默认值 vuex管理
import store from './store'

//引入插件
import VueSweetalert2 from './plugins/vue-sweetalert2'
Vue.use(VueSweetalert2)

//引入message插件
import Message from './plugins/message'
Vue.use(Message)
//引入过滤器
import './filters'
import {mockArticles} from "./mock/data";
import ls from './utils/localStorage'

Vue.config.productionTip = false

//加入测试数据
const AddMockData = (() => {
  // 是否加入测试数据
  const isAddMockData = true
  // 用户数据
  let userArticles = ls.getItem('articles')

  if (Array.isArray(userArticles)) {
    userArticles = userArticles.filter(article => parseInt(article.uid) === 1)
  } else {
    userArticles = []
  }

  if (isAddMockData) {
    // 合并用户数据和测试数据，使用合并值作为所有文章
    store.commit('UPDATE_ARTICLES', [...userArticles, ...mockArticles(60)])
  } else {
    // 使用用户数据作为所有文章
    store.commit('UPDATE_ARTICLES', userArticles)
  }
})()


// eslint 配置，允许 new 一个实例后不赋值，我们没有使用 eslint，如果有，则下一行注释不可缺少
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //注：{ App } 是 { App: App } 的缩写，ES6（ECMAScript 6）允许在对象中直接写变量，此时的属性名为变量名，属性值为变量的值。
  //注入store
  store,//我们通过 store 选项，将仓库实例注入到每一个子组件中，这样子组件就能通过 this.$store 访问仓库。
  components: { App },
  template: '<App/>'
})
