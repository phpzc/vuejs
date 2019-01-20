//下拉指令

export default {

    bind(el, binding, vnode) {
        const handler = () => {
            //找到当前元素的父元素 切换它的open类
            el.parentElement.classList.toggle('open')
        }

        const documentHandler = (e) => {
            //当前点击的目标
            const target = e.target

            // 如果点击的是当前元素 或者是当前元素的后代节点 就不处理
            if(target.isSameNode(el) || el.contains(target)) return

            //找到当前元素的父元素 移除open 类
            el.parentElement.classList.remove('open')
        }


        el.addEventListener('click', handler, false)

        document.addEventListener('click',documentHandler,false)

        el.destroy = () => {
            el.removeEventListener('click', handler, false)
            document.removeEventListener('click',documentHandler, false)
            el.destroy = null
        }

    },
    unbind(el) {
        el.destroy()
    }

}
