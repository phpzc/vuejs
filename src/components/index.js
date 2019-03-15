import Vue from 'vue'
import Message from './Message'
import Modal from './Modal'
//分页
import Pagination from './Pagination'

const components = {
    Message,
    Modal,
    Pagination
}

for(const [key, value] of Object.entries(components)) {
    Vue.component(key,value)
}

