//返回添加用户信息后的所有文章
import {like} from "./actions";

export const computedArticles = (state) => {
    let articles = state.articles
    let newArticles = []

    //添加用户信息 参数 isCurrentUser 代表是否是当前用户
    const addUserInfo = function (isCurrentUser) {
        const userName = state.user && state.user.name
        const userAvatar = state.user && state.user.avatar
        const avatarUrl = 'https://api.adorable.io/avatars/200/'

        //是当前用户时 设置用户数据为当前用户的信息
        if(isCurrentUser) {
            this.uname = userName
            this.uavatar = userAvatar

        }else{
            this.uavatar = `${avatarUrl}${this.uname}`
        }
    }

    if(Array.isArray(articles)) {
        //深拷贝 articles
        newArticles = JSON.parse(JSON.stringify(articles))
        newArticles.forEach( (article)=>{
            const comments = article.comments
            const likeUsers = article.likeUsers

            //添加用户信息到文章
            if(article.uid === 1) {
                addUserInfo.call(article, true)
            }else{
                addUserInfo.call(article)
            }

            //添加用户信息到评论
            if(Array.isArray(comments)) {
                comments.forEach( (comment)=>{
                    if(comment.uid === 1){
                        addUserInfo.call(comment, true)
                    }else{
                        addUserInfo.call(comment)
                    }
                })
            }

            //添加用户信息到点赞
            if( Array.isArray(likeUsers)) {

                likeUsers.forEach( (likeUser)=> {
                    if(likeUser.uid === 1){
                        addUserInfo.call(likeUser, true)
                    }else{
                        addUserInfo.call(likeUser)
                    }
                })
            }

        })
    }


    return newArticles
}

//返回指定uid下的所有文章 参数uid 是用户uid user是用户名
export const getArticlesByUid = (state, getters) => (uid, user) => {
    //使用派生状态 computedArticles作为所有文章
    let articles = getters.computedArticles

    if( Array.isArray(articles)) {
        if(user){
            //有用户名时 遍历所有文章
            for(const article of articles){
                if(article.uname === user) {
                    uid = article.uid
                    break
                }
            }
        }

        //使用指定uid 过滤所有文章
        articles = articles.filter( article => parseInt(uid) === parseInt(article.uid) )

    }else{
        articles = []
    }

    return articles
}

//返回使用filter参数过滤后的所有文章
export const getArticlesByFilter = (state,getters) => (filter) => {
    let articles = getters.computedArticles
    let filteredArticles = []
    if(Array.isArray(articles)) {
        filteredArticles = articles.map( article => ({...article}))

        switch(filter) {
            case 'excellent':
                //将当前用户的文章设置为精华文章
                filteredArticles = getters.getArticlesByUid(1)
                break
            case 'vote':
                //将赞的最多的文章排在前面
                filteredArticles.sort( (a,b) => {
                    const alikeUsers = Array.isArray(a.likeUsers) ? a.likeUsers:[]
                    const blikeUsers = Array.isArray(b.likeUsers) ? b.likeUsers:[];

                    return blikeUsers.length - alikeUsers.length
                })

                break
            case 'recent':
                //将最新写的文章 排在前面
                filteredArticles.reverse()
                break
            case 'noreply':
                //将评论最少的文章排在前面
                filteredArticles.sort((a, b) => {
                    const aComments = Array.isArray(a.comments) ? a.comments : []
                    const bComments = Array.isArray(b.comments) ? b.comments : []

                    return aComments.length - bComments.length
                })
                break
            default:
                //默认将回复时间最新的文章排在前面
                filteredArticles.sort( (a,b) => {
                    const aComments = Array.isArray(a.comments) ? a.comments : []
                    const bComments = Array.isArray(b.comments) ? b.comments : []
                    const aCommentsLength = aComments.length
                    const bCommentsLength = bComments.length

                    if (aCommentsLength > 0) {
                        if (bCommentsLength > 0) {
                            return new Date(bComments[bCommentsLength - 1].date) - new Date(aComments[aCommentsLength - 1].date)
                        } else {
                            return -1
                        }
                    } else {
                        return 1
                    }
                })
                break

        }
    }

    return filteredArticles
}