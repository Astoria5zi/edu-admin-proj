// 用户相关仓库
import { defineStore } from "pinia";

// 引入用户相关接口
import { reqUserLogin, reqGetToken, reqLogout } from "@/api/user";
import { ElMessage } from "element-plus";


let useUserStore = defineStore('User', {
    // 存储数据的地方
    state: () => {
        return {
            token: localStorage.getItem("TOKEN"), // 用户唯一标识
            isLogin: false,
            userInfo: {
                "id": '',
                "username": "",
                "password": "",
                "salt": null,
                "wxUnionid": null,
                "nickname": "",
                "name": "",
                "userpic": "",
                "companyId": null,
                "utype": "",
                "birthday": "",
                "sex": "1",
                "email": "",
                "cellphone": "",
                "qq": "",
                "status": "",
                "createTime": "",
                "updateTime": ""
            }
        }
    },
    // 处理异步|逻辑
    actions: {
        // 用户登录方法
        async userLogin(userLoginDTO: any) {
            let result = await reqUserLogin(userLoginDTO)
            // 登陆成功
            if (result.code == 200) {
                this.isLogin = true
                this.userInfo = result.data
                return 'OK'
            }
            // 登陆失败：提示信息
            else {
                return Promise.reject(new Error(result.data))
            }
        },
        async userLogout() {
            let result = await reqLogout()
            if (result.code == 200) {
                this.isLogin = false
            } else {
                ElMessage.error("登出失败")
            }

        }

        // 获取用户信息方法
    },
    // 
    getters: {

    }
})

// 对外暴露
export default useUserStore