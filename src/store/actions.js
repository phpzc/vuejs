import router from '../router'

export const post = ( { commit, state}, {article,articleId}) => {
    let articles = state.articles

    if(!Array.isArray(articles)) articles = []

    if(article) {
        const uid = 1

        const {title, content} = article
        const date = new Date()

        if( articleId === undefined) {
            //最后一篇文章
            const lastArticle = articles[articles.length - 1]

            if(lastArticle) {
                articleId = parseInt(lastArticle.articleId) + 1
            }else{
                articleId = articles.length + 1
            }
            // 将当前文章添加到所有文章
            articles.push({
                uid,
                articleId,
                title,
                content,
                date
            })
        }else {
            for (let article of articles) {
                if (parseInt(article.articleId) === parseInt(articleId)) {
                    article.title = title
                    article.content = content
                    break
                }
            }
        }
        // 更新所有文章
        commit('UPDATE_ARTICLES',articles)
        // 跳转到首页，并附带 articleId 和 showMsg 参数，showMsg 用来指示目标页面显示一个提示，我们稍后添加相关逻辑
        //router.push({name:'Home', params:{articleId, showMsg:true}})
        router.push({name:'Content', params:{ articleId, showMsg:true}})
        
    } else {
        for( let article of articles) {
            if(parseInt(article.articleId) === parseInt(articleId)) {
                articles.splice(articles.indexOf(article), 1)
                break
            }
        }
        commit('UPDATE_ARTICLES',articles)
        router.push({name:'Home',params:{ showMsg:true}})
    }
}

export const like = ( {commit, state}, { articleId, isAdd }) => {
    let articles = state.articles
    let likeUsers = []

    const uid = 1

    if(!Array.isArray(articles)) articles = []

    for(let article of articles) {

        if(parseInt(article.articleId) === parseInt(articleId)) {

            //更新点赞用户列表
            likeUsers = Array.isArray(article.likeUsers) ? article.likeUsers : likeUsers

            if(isAdd) {
                //是否已点赞
                const isAdded = likeUsers.some( likeUser => parseInt(likeUser.uid) === uid ) //检测uid

                if(!isAdded){
                    likeUsers.push( {uid})
                }
            } else {
                for (let likeUser of likeUsers) {
                    if( parseInt(likeUser.uid) === uid ) {
                        likeUsers.splice( likeUsers.indexOf(likeUser), 1)
                        break
                    }
                }
            }

            //更新文章的点赞用户列表
            article.likeUsers = likeUsers
            break
        }

    }

    commit('UPDATE_ARTICLES', articles)

    return likeUsers
}

//articleId是文章id comment是评论内容 commentId是评论id
export const comment = ({commit,state}, {articleId, comment, commentId}) => {
    let articles = state.articles
    let comments = []

    if(!Array.isArray(articles)) articles=[]

    for(let article of articles) {

        if(parseInt(article.articleId) === parseInt(articleId)) {

            //更新评论列表
            comments = Array.isArray(article.comments) ? article.comments : comments

            if(comment) {
                //获取用户传入的评论内容设置用户id 默认为1
                const { uid = 1, content } = comment
                const date = new Date()

                if( commentId === undefined) {
                    const lastComment = comments[comments.length - 1]

                    //新建commentId
                    if(lastComment) {
                        commentId = parseInt(lastComment.commentId) + 1

                    }else{
                        commentId = comments.length + 1
                    }

                    //在评论列表加入当前评论
                    comments.push({
                        uid,commentId,content,date
                    })

                }

            }

            //更新文章的评论列表
            article.comments = comments
            break
        }
    }

    //提交UPDATE_ARTICLES 更新所有文章
    commit('UPDATE_ARTICLES',articles)

    //返回评论列表
    return comments
}