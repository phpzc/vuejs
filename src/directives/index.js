import Vue from 'vue'
import validator from './validator'
import dropdown from './dropdown'

//注册全局验证指令
//Vue.directive('validator',validator)

//注册全局指令
const directives = {
    // 验证
    validator,
    // 下拉
    dropdown
}

//Object.entries 返回给定对象的键值对数组
for (const [key,value] of Object.entries(directives)) {
    Vue.directive(key,value)
}
