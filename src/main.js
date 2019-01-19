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

Vue.config.productionTip = false

// eslint 配置，允许 new 一个实例后不赋值，我们没有使用 eslint，如果有，则下一行注释不可缺少
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //注：{ App } 是 { App: App } 的缩写，ES6（ECMAScript 6）允许在对象中直接写变量，此时的属性名为变量名，属性值为变量的值。
  components: { App },
  template: '<App/>'
})
