// 保存学生相关的api
import request from "@/utils/request"
// 学生用户相关的请求地址
enum API {
    // 获取学生列表接口
    GETSTUDENTLIST_URL = '/user/students?'
}

// 获取所有学生信息请求
export const reqGetStudentList = (pageNo?: number, pageSize?: number) => {

    if (!pageNo && !pageSize) {
        return request.get<any, any>(API.GETSTUDENTLIST_URL)
    }
    else {
        return request.get<any, any>(API.GETSTUDENTLIST_URL + `pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}

