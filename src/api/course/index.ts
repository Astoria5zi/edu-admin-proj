// 统一管理课程相关的接口
import request from "@/utils/request"
// 课程用户相关的请求地址
enum API {
    // LOGIN_URL = 'http://114.115.179.162:8022/prod-api/admin/acl/index/login',

    // 获取分页课程列表接口
    COURSELIST_URL = "/course/list?",
    // 根据id查询课程详细信息
    GETCOURSEBYID_URL = '/course/',
    // 查询树状课程接口
    TREENODECOURSE_URL = '/course-category/tree-nodes/',



}

// 获取所有课程信息接口
export const reqCourseList = (pageNo: number, pageSize: number, data: any) => request.post<any, any>(API.COURSELIST_URL + `pageNo=${pageNo}&pageSize=${pageSize}`, data)

// 根据id获取课程相关信息
export const reqGetCourseById = (id: number) => request.get<any, any>(API.GETCOURSEBYID_URL + `${id}`)

// 获取树状结构课程信息方法
export const reqGetTreeNodeCourse = () => request.get<any, any>(API.TREENODECOURSE_URL)

// 根据分类id查询对应课程信息方法
export const reqGetTreeNodeCourseById = (id: number) => request.get<any, any>(API.TREENODECOURSE_URL + `${id}`)