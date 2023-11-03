// 本文件用来存放班级管理的接口
import request from "@/utils/request"

enum API {
    // 查询班级教师接口
    CLASSTEACHER_URL = '/class/teacher/list?',
    // 添加班级教师接口
    ADDCLASSTEACHER_URL = '/class/teacher/add?',
    // 删除班级教师接口
    DELETECLASS_URL = '/class/teacher/delete',
    // 更新班级教师接口
    UPDATACLASSTEACHER_URL = '/class/teacher/update?',
    // 获取班级学生
    GETCLASSSTUDENT_URL = '/class/student/list?',
    // 修改学生成绩接口
    UPDATESTUDENTSCORE_URL = '/class/student/score?',
    // 添加班级学生接口
    ADDCLASSSTUDENT_URL = '/class/student/add?',
    // 批量删除班级学生接口
    REMOVESTUDENT_URL = '/class/student/delete?',
    // 修改学生缴费状态接口
    UPDATEPAYSTATUS_URL = '/class/student/isPay?'

}

// 查询班级教师方法
export const reqClassTeacher = (courseId: number) => request.get<any, any>(API.CLASSTEACHER_URL + `courseId=${courseId}`)

// 添加班级教师方法
export const reqAddClassTeacher = (courseId: number, teachers: any) => request.post<any, any>(API.ADDCLASSTEACHER_URL + `courseId=${courseId}`, teachers)

// 更新班级教师方法
export const reqUpdateClassTeacher = (courseId: number, teachers: any) => request.put(API.UPDATACLASSTEACHER_URL + `courseId=${courseId}`, teachers)

// 获取班级学生方法
export const reqGetClassStudent = (courseId: number, pageNo?: number, pageSize?: number) => {

    if (!pageNo && !pageSize) {
        return request.post<any, any>(API.GETCLASSSTUDENT_URL + `courseId=${courseId}`)
    }
    else {
        return request.post<any, any>(API.GETCLASSSTUDENT_URL + `courseId=${courseId}&pageNo=${pageNo}&pageSize=${pageSize}`)
    }
}

// 修改学生成绩方法
export const reqUpdateStudentScore = (courseId: number, score: number, userId: number) => request.put<any, any>(API.UPDATESTUDENTSCORE_URL + `courseId=${courseId}&score=${score}&userId=${userId}`)

// 添加班级学生接口
export const reqAddClassStudent = (courseId: number, students: any) => request.post<any, any>(API.ADDCLASSSTUDENT_URL + `courseId=${courseId}`, students)

// 删除班级学生接口
export const reqRemoveClassStudent = (courseId: number, students: any) => request.delete<any, any>(API.REMOVESTUDENT_URL + `courseId=${courseId}`, students)

// 修改学生缴费接口
export const reqUpdatePayStutas = (courseId: number, payCode: any, userId: number) => request.put<any, any>(API.UPDATEPAYSTATUS_URL + `courseId=${courseId}&payCode=${payCode}&userId=${userId}`)