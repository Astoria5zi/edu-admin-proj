// 保存学生相关的api
import request from "@/utils/request"
// 学生用户相关的请求地址
enum API {
    // 获取学生列表接口
    GETSTUDENTLIST_URL = '/student/list?',
    // 删除学生接口
    DELETESTUDENT_URL = '/student/delete/',
    // 修改学生接口
    UPDATESTUDENT_URL = '/student/update',
    // 根据id获取学生信息
    GETSTUINFOBYID_URL = '/student/get/'
}

// 获取所有学生信息请求
export const reqGetStudentList = (pageNo?: number, pageSize?: number) => {

    if (!pageNo && !pageSize) {
        return request.post<any, any>(API.GETSTUDENTLIST_URL)
    }
    else {
        return request.post<any, any>(API.GETSTUDENTLIST_URL + `pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}

// 删除学生方法
export const reqDeleteStudent = (stuId: number) => request.delete<any, any>(API.DELETESTUDENT_URL + `${stuId}`)

// 修改学生信息
export const reqUpdateStudent = (xcStudent: any) => request.put<any, any>(API.UPDATESTUDENT_URL, xcStudent)

// 根据id获取学生信息方法
export const reqGetStudentInfoById = (stuId: number) => request.get<any, any>(API.GETSTUINFOBYID_URL + `${stuId}`)

