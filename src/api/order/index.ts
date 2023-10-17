// 本文件用来存放订单相关的接口
import request from "@/utils/request"

enum API {
    // 订单分页查询接口
    GETORDERLIST_URL = '/orders/list?',
    // 订单修改接口
    UPDATAORDER_URL = '/orders/update',
    // 订单删除接口
    DELETEORDER_URL = '/orders/delete/one?',
    // 根据id查询订单接口
    GETORDERINFOBYID_URL = '/orders/get?',
}

// 分页查询订单列表方法
export const reqGetOrderList = (pageNo: number, pageSize: number) => {
    return request.post<any, any>(API.GETORDERLIST_URL + `pageNo=${pageNo}&pageSize=${pageSize}`)
}

// 修改订单方法
export const reqUpdateOrder = (orders: any) => request.put<any, any>(API.UPDATAORDER_URL, orders)

// 根据id查询订单接口
export const reqGetOrderInfoById = (courseId: number, userId: number) => request.get<any, any>(API.GETORDERINFOBYID_URL + `courseId=${courseId}&userId=${userId}`)

// 根据订单id删除订单
export const reqDeleteOrderById = (orderId: number) => request.delete<any, any>(API.DELETEORDER_URL + `ordersId=${orderId}`)


