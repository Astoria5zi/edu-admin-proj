// 此文件进行路由鉴权
import router from '@/router'

// 获取仓库
import pinia from './store'
import useUserStore from './store/user'
let userStore = useUserStore(pinia)

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // 获取token判断是否登录
    let token = userStore.token
    // 获取用户信息
    let userInfo = userStore.userInfo
    // 有token
    if (token) {
        if (userInfo.username) {
            next()
        } else {
            // 无用户信息，在此处发请求获取用户信息
            try {
                let result = await userStore.getUserInfo()
                next()
            } catch (error) {
                // token过期或者token被修改
                await userStore.userLogout()
                next()
            }
        }
    }
    // 无token
    else {
        console.log('无token');
        next()
    }


})