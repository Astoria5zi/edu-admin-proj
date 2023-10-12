// 用户相关接口
import request from "@/utils/request"
import { use } from "video.js/dist/types/tech/middleware"
// 课程用户相关的请求地址
enum API {
    // 获取课程列表接口
    USERLOGIN_URL = "/user/login",
    // 分页获取用户信息
    GETUSERLIST_URL = '/user/list?',
    // 新增用户信息
    ADDUSER_URL = '/user/save',
    // 按id删除用户信息
    REMOVEUSER_URL = '/user/delete/',
    // 修改用户信息
    EDITUSER_URL = '/user/update',
    // 按id查询用户
    GETUSERBYID_URL = '/user/',
    // 更改用户状态接口
    CHANGESTATUS_URL = '/user/status/'
}

// 获取所有课程信息方法
export const reqUserLogin = (userLoginDTO: any) => request.post<any, any>(API.USERLOGIN_URL, userLoginDTO)

// 分页获取用户信息方法
export const reqGetUserList = (pageNo: number, pageSize: number) => {
    if (!pageNo && !pageSize) {
        return request.post<any, any>(API.GETUSERLIST_URL)
    }
    else {
        return request.post<any, any>(API.GETUSERLIST_URL + `pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}

// 新增用户信息方法
export const reqAddUser = (userDTO: any) => request.post<any, any>(API.ADDUSER_URL, userDTO)

// 删除用户信息方法
export const reqRemoveUser = (id: number) => request.delete<any, any>(API.REMOVEUSER_URL + `${id}`)

// 更改用户信息方法
export const reqEditUser = (userDTO: any) => request.put<any, any>(API.EDITUSER_URL, userDTO)

// 通过id获取用户信息方法
export const reqGetUserById = (id: any) => request.get<any, any>(API.GETUSERBYID_URL + `${id}`)

// 更改用户状态方法
export const reqChangeUserStatus = (id: number, status: string) => request.post<any, any>(API.CHANGESTATUS_URL + `${status}?id=${id}`)
