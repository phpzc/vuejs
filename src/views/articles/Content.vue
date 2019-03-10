<template>
    <div class="col-md-9 left-col pull-right">
        <div class="panel article-body content-body">
            <h1 class="text-center">{{ title }}</h1>
            <div class="article-meta text-center">
                <i class="fa fa-clock-o"></i>
                <abbr>{{ date | moment('from') }}</abbr>
            </div>
            <div class="entry-content">
                <div class="content-body entry-content panel-body ">
                    <div class="markdown-body" v-html="content"></div>

                    <div v-if="auth && uid === 1" class="panel-footer operate">
                        <div class="actions">
                            <a @click="deleteArticle" class="admin" href="javascript:;"><i class="fa fa-trash-o"></i></a>
                            <a @click="editArticle" class="admin" href="javascript:;"><i class="fa fa-pencil-square-o"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 点赞 -->
        <div class="votes-container panel panel-default padding-md">
            <div class="panel-body vote-box text-center">
                <div class="btn-group">
                    <a @click="like" href="javascript:;" class="vote btn btn-primary popover-with-html" :class="likeClass">
                        <i class="fa fa-thumbs-up"></i> {{ likeClass ? '已赞' : '点赞' }}
                    </a>
                    <div class="or"></div>
                    <button @click="showQrcode = true" class="btn btn-success"><i class="fa fa-heart"></i> 打赏</button>
                </div>
                <div class="voted-users">
                    <div class="user-lists">
                        <span v-for="likeUser in likeUsers">
                          <!-- 点赞用户是当前用户时，加上类 animated 和 swing 以显示一个特别的动画  -->
                          <img :src="user && user.avatar" class="img-thumbnail avatar avatar-middle" :class="{ 'animated swing' : likeUser.uid === 1 }">
                        </span>
                    </div>
                    <div v-if="!likeUsers.length" class="vote-hint">成为第一个点赞的人吧 ?</div>
                </div>
            </div>
        </div>

        <!--打赏弹框-->
        <Modal :show.sync="showQrcode" class="text-center">
            <div v-if="user" slot="title">
                <img :src="user.avatar" class="img-thumbnail avatar" width="48" >
            </div>

            <div>
                <p class="text-md">如果你想学习更多前端的知识，VuejsCaff.com 是个不错的开始</p>
                <div class="payment-qrcode inline-block">
                    <h5>扫一扫打开 VuejsCaff.com</h5>
                    <p><img src="https://vuejscaffcdn.phphub.org/uploads/images/201803/25/2/g3CFVs0h7B.jpeg?imageView2/2/w/1024/h/0" width="160"></p>
                </div>
            </div>

            <div slot="footer">
                <div class="text-center">祝你学习愉快 :)</div>
            </div>

        </Modal>

        <!-- 评论列表 -->
        <div class="replies panel panel-default list-panel replies-index">
            <div class="panel-heading">
                <div class="total">
                    回复数量: <b>{{ comments.length }}</b>
                </div>
            </div>
            <div class="panel-body">
                <!--<ul id="reply-list" class="list-group row">-->
                <transition-group id="reply-list" name="fade" tag="ul" class="list-group row">
                    <li v-for="(comment,index) in comments" :key="comment.commentId" class="list-group-item media">
                        <div class="avatar avatar-container pull-left">
                            <router-link :to="`/${comment.uname}`">
                                <img :src="comment.uavatar" class="media-object img-thumbnail avatar avatar-middle">
                            </router-link>
                        </div>

                        <div class="infos">
                            <div class="media-heading">
                                <router-link :to="`/${comment.uname}`" class="remove-padding-left author rm-link-color">
                                    {{ comment.uname }}
                                </router-link>

                                <div class="meta">
                                    <a :id="`reply${index + 1}`" :href="`#reply${index + 1}`" class="anchor">#{{ index + 1 }}</a>
                                    <span> ⋅ </span>
                                    <abbr class="timeago">
                                        {{ comment.date | moment('from', { startOf: 'second' })}}
                                    </abbr>
                                </div>

                            </div>
                        </div>

                        <div class="preview media-body markdown-reply markdown-body" v-html="comment.content">

                        </div>
                    </li>
                </transition-group>
                <!--</ul>-->

                <div v-show="!comments.length" class="empty-block">
                    暂无评论~~
                </div>
            </div>
        </div>

        <!-- 评论框 -->
        <div id="reply-box" class="reply-box form box-block">
            <div class="form-group comment-editor">
                <textarea v-if="auth" id="editor"></textarea>
                <textarea v-else disabled class="form-control" placeholder="需要登录后才能发表评论"  style="height:172px"></textarea>
            </div>

            <div class="form-group reply-post-submit">
                <button id="reply-btn" :disabled="!auth" @click="comment" class="btn btn-primary">回复</button>
                <span class="help-inline">Ctrl+Enter</span>
            </div>

            <div v-show="commentHtml" id="preview-box" class="box preview markdown-body" v-html="commentHtml"></div>
        </div>
    </div>
</template>

<script>
    import SimpleMDE from 'simplemde'
    import hljs from 'highlight.js'
    import emoji from 'node-emoji'
    // 引入 mapState 辅助函数
    import { mapState } from 'vuex'
    //引入qrcode.vue的默认值
    import QrcodeVue from 'qrcode.vue'

    export default {
        name: 'Content',
        data() {
            return {
                title: '', // 文章标题
                content: '', // 文章内容
                date:'',//创建时间
                uid:1,
                likeUsers:[],//点赞用户列表
                likeClass:'',//点赞样式
                showQrcode:false, //是否显示打赏弹窗
                commentHtml:'',//评论 HTML
                comments:[],//评论列表
            }
        },
        computed:{
            ...mapState([
                'auth',
                'user',
            ])
        },
        created() {
            const articleId = this.$route.params.articleId
            const article = this.$store.getters.getArticleById(articleId)

            if(article) {
                //获取文章的comments
                let { uid,title, content,date, likeUsers, comments } = article

                this.uid = uid
                this.title = title
                //this.content = SimpleMDE.prototype.markdown(content)
                this.content = SimpleMDE.prototype.markdown(emoji.emojify(content,name => name) )
                this.date = date

                this.likeUsers = likeUsers || []
                this.likeClass = this.likeUsers.some( likeUser => parseInt(likeUser.uid) === 1) ? 'active' : ''

                //渲染文章的comments
                this.renderComments(comments)

                this.$nextTick( ()=>{
                    this.$el.querySelectorAll('pre code').forEach( (el) => {
                        hljs.highlightBlock(el)
                    })
                })

            }

            this.articleId = articleId
        },
        mounted(){

            //已登录时
            if(this.auth){
                window.hljs = hljs

                const simplemde = new SimpleMDE({
                    element:document.querySelector('#editor'),
                    placeholder: '请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。',
                    spellChecker: false,
                    autoDownloadFontAwesome: false,
                    // 不显示工具栏
                    toolbar: false,
                    // 不显示状态栏
                    status: false,
                    renderingConfig: {
                        codeSyntaxHighlighting: true
                    }
                })

                //内容改变监听
                simplemde.codemirror.on('change', ()=>{
                    //更新commentMarkDown 为编辑器内容
                    this.commentMarkdown = simplemde.value()
                    //更新 commentHtml 我们先替换原内容中的emoji标识 在使用markdown 方法将内容转出html
                    this.commentHtml = simplemde.markdown( emoji.emojify( this.commentMarkdown, name => name ))
                })

                //安键松开监听
                simplemde.codemirror.on('keyup', (codemirror, event)=>{
                    //使用 ctrl + enter 时提交评论
                    if (event.ctrlKey && event.keyCode === 13) {
                        this.comment()
                    }
                })

                //将编辑器添加到当前实例
                this.simplemde = simplemde
            }
        },
        methods: {
            editArticle() {
                this.$router.push({name:'Edit',params:{ articleId: this.articleId }})
            },
            deleteArticle() {
                this.$swal({
                    text:'你确定要删除此内容吗?',
                    confirmButtonText:'删除'
                }).then( (res) => {
                    if(res.value) {
                        this.$store.dispatch('post',{articleId: this.articleId})
                    }
                })
            },
            like(e) {
                if ( !this.auth) {
                    //未登录
                    this.$swal({
                        text: '需要登录以后才能执行此操作。',
                        confirmButtonText: '前往登录'
                    }).then((res) => {
                        if (res.value) {
                            this.$router.push('/auth/login')
                        }
                    })
                }else{
                    const target = e.currentTarget
                    const active = target.classList.contains('active')
                    const articleId = this.articleId

                    if(active) {
                        this.likeClass = ''
                        this.$store.dispatch('like',{articleId}).then( (likeUsers) => {
                            this.likeUsers = likeUsers
                        })
                    }else{
                        this.likeClass = 'active animated rubberBand'

                        this.$store.dispatch('like', {articleId, isAdd:true}).then( (likeUsers) => {
                            this.likeUsers = likeUsers
                        })
                    }
                }
            },
            comment() {
                //编辑器的内容不为空时
                if( this.commentMarkdown && this.commentMarkdown.trim() !== '' ) {
                    //分发comment事件 以提交评论
                    this.$store.dispatch('comment', {
                        comment: { content: this.commentMarkdown} ,
                        articleId: this.articleId,
                    }).then(this.renderComments) //渲染评论



                    //清空编辑器
                    this.simplemde.value('')
                    //使得回复按钮获得焦点
                    document.querySelector('#reply-btn').focus()

                    //将最后的评论滚动到页面的 顶部
                    this.$nextTick( ()=>{
                        //页面效果 滚动到顶部
                        const lastComment = document.querySelector('#reply-list li:last-child')
                        if(lastComment)
                            lastComment.scrollIntoView(true)
                    })
                }
            },
            renderComments(comments) {
                if(Array.isArray(comments)) {
                    //深拷贝 comments 以不影响原数据
                    const newComments = comments.map( comment => ( {...comment}))
                    const user = this.user || {}

                    for( let comment of newComments) {
                        comment.uname = user.name
                        comment.uavatar = user.avatar
                        //评论内容从markdown转为html
                        comment.content = SimpleMDE.prototype.markdown( emoji.emojify(comment.content, name => name ))

                    }

                    this.comments = newComments
                    this.commentsMarkdown = comments

                }
            },
        }
    }
</script>

<style scoped>
    .fade-enter-active, .fade-leave-active { transition: opacity .5s;}
    .fade-enter, .fade-leave-to { opacity: 0;}
</style>