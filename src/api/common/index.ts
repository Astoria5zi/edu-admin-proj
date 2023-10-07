// 通用接口
import request from "@/utils/request"

enum API {
    // 上传文件接口
    UPLOADFILE = '/common/upload'
}

// 上传文件方法
export const reqUploadFile = (file: any) => request.post<any, any>(API.UPLOADFILE, file)