// 本文件用来存放订单相关的接口
import request from "@/utils/request"

enum API {
    // 查询课程数量接口
    GETCOURSECOUNT_URL = '/statistic/courseCount',
    // 查询订单数量接口
    GETORDERCOUNT_URL = '/statistic/orderCount',
    // 查询价格折线图接口
    GETORDERLINE_URL = '/statistic/orderLine',
    // 查询学生数量接口
    GETSTUDENTCOUNT_URL = '/statistic/studentCount',
    // 查询教师数量接口
    GETTEACHERCOUNT_URL = '/statistic/teacherCount',
    // 查询用户数量接口
    GETUSERCOUNT_URL = '/statistic/teacherCount',
    // 查询用户饼图接口
    GETUSERPIE_URL = '/statistic/userPie',
    // 查询课程类型柱状图
    GETCOURSEBAR_URL = '/statistic/courseType'

}


// 获取课程数量方法
export const reqGetCourseCount = () => request.get<any, any>(API.GETCOURSECOUNT_URL);
// 获取订单数量方法
export const reqGetOrderCount = () => request.get<any, any>(API.GETORDERCOUNT_URL);
// 获取价格折线图方法
export const reqGetOrderLine = () => request.get<any, any>(API.GETORDERLINE_URL);
// 获取学生数量方法
export const reqGetStudentCount = () => request.get<any, any>(API.GETSTUDENTCOUNT_URL);
// 获取教师数量方法
export const reqGetTeacherCount = () => request.get<any, any>(API.GETTEACHERCOUNT_URL);
// 获取用户数量方法
export const reqGetUserCount = () => request.get<any, any>(API.GETUSERCOUNT_URL);
// 查询用户饼图方法
export const reqGetUserPie = () => request.get<any, any>(API.GETUSERPIE_URL);
// 查询课程柱状图方法
export const reqGetCourseBar = () =>request.get<any,any>(API.GETCOURSEBAR_URL)