// 用户相关接口
import request from "@/utils/request"
// 课程用户相关的请求地址
enum API {
    // 获取课程列表接口
    USERLOGIN_URL = "/user/login"
}

// 获取所有课程信息接口
export const reqUserLogin = (userLoginDTO : any) => request.post<any, any>(API.USERLOGIN_URL, userLoginDTO)