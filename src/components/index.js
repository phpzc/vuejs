import Vue from 'vue'
import Message from './Message'
import Modal from './Modal'
//分页
import Pagination from './Pagination'
// 轮播
import Slider from './Slider'

const components = {
    Message,
    Modal,
    Pagination,
    Slider
}

for(const [key, value] of Object.entries(components)) {
    Vue.component(key,value)
}

