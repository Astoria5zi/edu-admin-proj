// 用户相关仓库
import { defineStore } from "pinia";

// 引入用户相关接口
import { reqUserLogin } from "@/api/user";

let useUserStore = defineStore('User', {
    // 存储数据的地方
    state: () => {
        return {
            token: localStorage.getItem("TOKEN"), // 用户唯一标识
        }
    },
    // 处理异步|逻辑
    actions: {
        // 用户登录方法
        async userLogin(userLoginDTO: any) {
            let result = await reqUserLogin(userLoginDTO)
            // 登陆成功
            if (result.code == 1) {
                // 获取TOKEN
                this.token = result.data.token
                // 本地存储TOKEN
                localStorage.setItem("TOKEN", this.token as string)
                return 'OK'
            }
            // 登陆失败：提示信息
            else {
                return Promise.reject(new Error(result.data))
            }
        },

        // 获取用户信息方法
    },
    // 
    getters: {

    }
})

// 对外暴露
export default useUserStore