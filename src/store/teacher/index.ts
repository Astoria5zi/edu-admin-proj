// 教师相关仓库
import { defineStore } from "pinia";


export const useTeacherStore = defineStore('teacher', {
    state: () => {
        // 存储教师信息数组
        return {
            teacherArr: []
        }
    },

    actions: {
 
    },
    getters: {

    }
})


