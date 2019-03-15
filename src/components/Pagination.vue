<template>
    <ul v-if="totalPage > 1" class="pagination">
        <li :class="{disabled: internalCurrentPage === 1}">
            <a href="javascript:;" @click="changePage(internalCurrentPage - 1)">«</a>
        </li>
        <li v-for="n in totalPage" :class="{ active: internalCurrentPage === n}">
            <a href="javascript:;" @click="changePage(n)">{{ n }}</a>
        </li>
        <li :class="{disabled: internalCurrentPage === totalPage}">
            <a href="javascript:;" @click="changePage(internalCurrentPage + 1)">»</a>
        </li>
    </ul>
</template>

<script>
    export default {
        name: "Pagination",
        props: {
            currentPage:{
                type:Number,
                default:1
            },
            total: {
                type:Number,
                //指定此参数为 必传值
                required:true
            },
            pageSize:{
                type:Number,
                default: 10,
                validator: value => value > 0
            },

            onPageChange: {
                type:Function,
                default: ()=>{}
            }
        },
        data() {
            return {
                internalCurrentPage: 1
            }
        },
        computed: {
            //总页数
            totalPage() {
                return Math.ceil(this.total / this.pageSize)
            }
        },
        watch: {
            currentPage: {
                immediate: true,//immediate：其值为 true，将立即以表达式 currentPage 的当前值触发回调 handler;
                handler(page) { //handler：回调，参数别名 page 作为表达式的当前值，回调可以有第二个参数，作为表达式的旧值; 这里使用 immediate 配置，是因为我们需要在侦听开始之后，就立即更新 internalCurrentPage 的值，这样才能正确的渲染组件的当前页。
                    //更新组件内的当前页， 为父组件上 currentPage 的当前值
                    this.internalCurrentPage = page
                }
            }
        },
        methods: {
            changePage( page ) {
                if( page === this.internalCurrentPage || page < 1 || page > this.totalPage) return

                //点击的不是当前页时 触发 onPageChange回调
                this.onPageChange(page)
            }
        }
    }
</script>

<style scoped>

</style>