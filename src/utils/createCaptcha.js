//验证码
//从指定的字符中，获取指定数量的随机字符作为验证码，最后返回包含验证码模板和验证码的对象。
export default function (num = 6, letters = 'QWERTYUIOPLKJHGFDSAZXCVBNM1234567890') {
    let tpl = ''
    let captcha = []

    try {
        //[...Array(num)] 中的 ... 是扩展运算符，我们可以用它展开一个数组或对象。
        captcha = [...Array(num)].map(
            () => letters[Math.floor(Math.random() * letters.length)]
        )
    }catch (e) {}

    captcha.forEach( item => {
        tpl += `<span class="flex1 hcenter">${item}</span>`
    })

    captcha = captcha.join('')

    return {
        tpl,
        captcha
    }
}