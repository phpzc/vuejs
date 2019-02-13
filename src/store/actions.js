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
        
    }
}