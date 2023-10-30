// 用户相关接口
import request from "@/utils/request"
// 课程用户相关的请求地址
enum API {
    // 登录接口
    USERLOGIN_URL = "/login/doLogin",
    // 获取TOKEN值
    GETUSERTOKEN_URL = '/login/tokenInfo',
    // 退出登录
    USERLOGOUT_URL = '/login/logout',
    // 获取当前用户信息
    GETUSERINFO_URL = '/login/getUser',
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
    CHANGESTATUS_URL = '/user/status/',
    // 通过姓名查找用户信息
    GETUSERBYNAME_URL = '/user/find?',
    // 获取验证码接口
    GETCHECKCODE_URL = '/login/common/verify'
}

// 获取所有课程信息方法
export const reqUserLogin = (userLoginDTO: any) => request.post<any, any>(API.USERLOGIN_URL, userLoginDTO)

// 获取TOKEN值方法
export const reqGetToken = () => request.get<any, any>(API.GETUSERTOKEN_URL)

// 退出登录方法
export const reqLogout = () => request.get<any, any>(API.USERLOGOUT_URL)

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

// 通过姓名获取用户信息 + 分页查询方法
export const reqGetUserByName = (name: string, pageNo?: number, pageSize?: number) => {
    if (!pageNo && !pageSize) {
        return request.post<any, any>(API.GETUSERBYNAME_URL + `name=${name}`)
    } else {
        return request.post<any, any>(API.GETUSERBYNAME_URL + `name=${name}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}

// 获取用户信息方法
export const reqGetUserInfo = () => request.get<any, any>(API.GETUSERINFO_URL)

// 获取验证码方法
export const reqGetCheckCode = () => request.get<any, any>(API.GETCHECKCODE_URL)
