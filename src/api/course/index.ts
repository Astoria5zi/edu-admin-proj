// 统一管理课程相关的接口
import request from "@/utils/request"
// 引入接口类型
// import { AddcourseResponse } from './type'
// 课程用户相关的请求地址
enum API {

	// 获取分页课程列表接口
	COURSELIST_URL = "/course/list?",
	// 根据id查询课程详细信息
	GETCOURSEBYID_URL = '/course/',
	// 查询树状课程接口
	TREENODECOURSE_URL = '/course-category/tree-nodes/',
	// 根据小分类节点查询课程信息(st:small treenodes?)
	GETCOURSEBYST_URL = '/course-category/st?',
	// 新增课程接口
	ADDNEWCOURSE_URL = '/course/add',
	// 删除课程接口
	REMOVECOURSE_URL = '/course/delete/'

}

// 获取所有课程信息接口
export const reqCourseList = (pageNo: number, pageSize: number, data: any) => request.post<any, any>(API.COURSELIST_URL + `pageNo=${pageNo}&pageSize=${pageSize}`, data)

// 根据id获取课程相关信息
export const reqGetCourseById = (id: number) => request.get<any, any>(API.GETCOURSEBYID_URL + `${id}`)

// 获取树状结构课程信息方法
export const reqGetTreeNodeCourse = () => request.get<any, any>(API.TREENODECOURSE_URL)

// 根据分类id查询对应课程信息方法
export const reqGetTreeNodeCourseById = (id: number) => request.get<any, any>(API.TREENODECOURSE_URL + `${id}`)

// 根据小分类节点查询课程信息方法
export const reqGetCourseBySt = (nodeId: string, pageNo?: number, pageSize?: number) => {
	if (!pageNo && !pageSize) {
		return request.post<any, any>(API.GETCOURSEBYST_URL + `nodeId=${nodeId}`)
	} else {
		return request.post<any, any>(API.GETCOURSEBYST_URL + `nodeId=${nodeId}&pageNo=${pageNo}&pageSize=${pageSize}`)
	}
}

// 新增课程方法
export const reqAddNewCourse = (addCourseDto: any) => request.post<any, any>(API.ADDNEWCOURSE_URL, addCourseDto)

// 按id删除课程方法
export const reqRemoveCourse = (id: number) => request.delete<any, any>(API.REMOVECOURSE_URL + `${id}`)