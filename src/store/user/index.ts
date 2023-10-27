// 用户相关仓库
import { defineStore } from "pinia";
// 引入用户相关接口
import { reqUserLogin, reqGetToken, reqLogout, reqGetUserInfo } from "@/api/user";
import { ElMessage } from "element-plus";


let useUserStore = defineStore('User', {
    // 存储数据的地方
    state: () => {
        return {
            token: localStorage.getItem('token'),
            isLogin: false,
            userLoginDTO: { password: '123456', username: '郭行骞2' },
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
        async userLogin() {
            let result = await reqUserLogin(this.userLoginDTO)
            // 登陆成功
            if (result.code == 200) {
                // 获取token
                let tokenres = await reqGetToken()
                this.token = tokenres.data.tokenValue
                // 将token保存到LocalStorage中
                localStorage.setItem('token', this.token);
                // 修改登录状态
                this.isLogin = true
                // 获取用户信息
                await this.getUserInfo()
                return 'OK'
            }
            // 登陆失败：提示信息
            else {
                return Promise.reject(new Error(result.data))
            }
        },
        // 获取用户信息方法
        async getUserInfo() {
            // 如果有token才获取信息
            if (this.token) {
                this.isLogin = true
                let result = await reqGetUserInfo()
                if (result.code == 200) {
                    this.userInfo = result.data
                }
            }
        },
        // 用户登出方法
        async userLogout() {
            let result = await reqLogout()
            if (result.code == 200) {
                this.isLogin = false
                this.token = null
                this.userInfo = {
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
                localStorage.removeItem('token')
            } else {
                ElMessage.error("登出失败")
            }
        },
    },
    // 
    getters: {

    },
    persist: true

})

// 对外暴露
export default useUserStore