// 本文件用来存放学生和课程之间关系的一些接口
import request from "@/utils/request"

enum API {
    // 学生选课接口
    STUCHOOSECOURSE_URL = '/chooseCourse/add?'
}

// 学生选课请求
export const reqStuChooseCourse = (courseId: number, userId: number) => {
    return request.post<any, any>(API.STUCHOOSECOURSE_URL + `courseId=${courseId}&userId=${userId}`)
}

