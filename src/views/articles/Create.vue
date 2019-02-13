<template>
    <div class="blog-container">
        <div class="blog-pages">
            <div class="col-md-12 panel">
                <div class="panel-body">
                    <h2 class="text-center">创作文章</h2>
                    <hr>
                    <div data-validator-form>
                        <div class="form-group">
                            <input v-model.trim="title" v-validator.required="{ title: '标题' }" type="text" class="form-control" placeholder="请填写标题">
                        </div>
                        <div class="form-group">
                            <!--<textarea  v-validator.required="{ title: '内容' }" class="form-control" placeholder="请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。"></textarea>-->
                            <textarea id="editor"></textarea>
                        </div>
                        <br>
                        <div class="form-group">
                            <button class="btn btn-primary" type="submit"  @click="post">发 布</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SimpleMDE from 'simplemde'
    import hljs from 'highlight.js'
    import ls from '@/utils/localStorage'

    //添加全局变量可以使 SimpleMDE 利用 highlight.js 对代码进行高亮，引入样式后，我们就能看到效果了
    window.hljs = hljs

    export default {
        name: "Create",
        data() {
          return {
              title:'',//文章标题
              content:'',//文章内容
              articleId: undefined,//文章id
          }
        },
        beforeRouteEnter(to,from,next) {
          next( vm => {
              //确认渲染组件时 设置articleId
              vm.setArticleId(vm.$route.params.articleId)
          })
        },
        beforeRouteLeave(to,from,next) {
          this.clearData()
          next()
        },
        watch:{
          '$route'(to) {
              this.clearData()
              this.setArticleId(to.params.articleId)
          }
        },
        mounted() {
            const simplemde = new SimpleMDE({
                element: document.querySelector('#editor'),
                placeholder:'请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。',
                //禁用拼写检查
                spellChecker: false,
                // 不用自动下载 FontAwesome，因为我们刚好有使用 FontAwesome，所以不用自动下载
                autoDownloadFontAwesome:false,
                // 启用自动保存，uniqueId 是一个用于区别于其他站点的标识
                autoSave: {
                    enabled: true,
                    uniqueId:'vuejs-essential'
                },
                // 启用代码高亮，需要引入 highlight.js
                renderingConfig: {
                    codeSyntaxHighlighting:true
                }
            })

            simplemde.codemirror.on('change', ()=>{
                this.content = simplemde.value()
            })

            this.simplemde = simplemde
            this.fillContent()
        },
        methods:{
            saveTitle() {
                ls.setItem('smde_title', this.title)
            },
            fillContent() {
                const simplemde = this.simplemde
                const title = ls.getItem('smde_title')

                if(title !== null){
                    this.title = title
                }
                this.content = simplemde.value()
            },
            post() {
                const title = this.title
                const content = this.content

                if( title !== '' && content.trim() !== '') {
                    const article = {
                        title,content
                    }

                    //console.log(article)
                    this.$store.dispatch('post',{article})
                    this.clearData()

                }
            },
            clearData() {
                this.title = ''
                ls.removeItem('smde_title')
                this.simplemde.value('')
                this.simplemde.clearAutosavedValue()

            }
        }
    }
</script>

<style scoped>
    .blog-container { max-width: 980px; margin: 0 auto; margin-top: 20px;}
    textarea { height: 200px; }
</style>