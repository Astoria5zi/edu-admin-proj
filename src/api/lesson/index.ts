// 本文件用来存放班级管理的接口
import request from "@/utils/request"

enum API {
    // 查询班级教师接口
    CLASSTEACHER_URL = '/class/teacher/list?',
    // 添加班级教师接口
    ADDCLASSTEACHER_URL = '/class/teacher/add?',
    // 删除班级教师接口
    DELETECLASS_URL = '/class/teacher/delete',

}

// 查询班级教师接口
export const reqClassTeacher = (courseId: number) => request.get<any, any>(API.CLASSTEACHER_URL + `courseId=${courseId}`)

// 添加班级教师接口
export const reqAddClassTeacher = (courseId: number, teachers: any) => request.post<any, any>(API.ADDCLASSTEACHER_URL + `courseId=${courseId}`, teachers)