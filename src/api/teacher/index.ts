// 保存教师相关的api
import request from "@/utils/request"
// 教师用户相关的请求地址
enum API {
    // 获取教师列表接口
    GETTEACHERLIST_URL = "/teacher/list?",
    // 根据ID删除教师接口
    DELETETEACHER_URL = "/teacher/delete/",
    // 增加教师接口
    ADDTEACHER_URL = "/user/save",
    // 根据教师id获得信息接口
    GETTEACHERBYID = "/teacher/",
    // 修改教师信息接口
    EDITTEACHER = "/teacher/update",
    // 根据name获取教师信息
    GETTEARCHERBYNAME = "/teacher/find/"
}

// 获取所有教师信息请求
export const reqGetTeacherList = (pageNo: number, pageSize: number) => request.post<any, any>(API.GETTEACHERLIST_URL + `pageNo=${pageNo}&pageSize=${pageSize}`)

// 根据ID删除教师信息
export const reqDeleteTeacher = (id: number) => request.delete<any, any>(API.DELETETEACHER_URL + id)

// 添加新教师
export const reqAddTeacher = (userDTO: any) => request.post<any, any>(API.ADDTEACHER_URL, userDTO)

// 根据ID获取教师信息
export const reqGetTeacherByID = (id: number) => request.get<any, any>(API.GETTEACHERBYID + `${id}`)

// 修改教师信息
export const reqEditTeacher = (data: any) => request.put<any, any>(API.EDITTEACHER, data)

// 根据name获取教师信息
export const reqGetTeacherByName = (name: string) => request.get<any, any>(API.GETTEARCHERBYNAME + `${name}`)
