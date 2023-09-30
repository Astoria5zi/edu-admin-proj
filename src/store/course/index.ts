// 课程相关仓库
import { defineStore } from "pinia";
export const useCourseStore = defineStore('course', {

  state: () => ({
    // 存储一级分类数据
    c1Arr: [],
    // 存储一级分类id
    c1Id: '',
    // 存储二级分类数据
    c2Arr: [],
    // 存储二级分类id
    c2Id: '',
    // 存储三级分类数据
    c3Arr: [],
    // 存储三级分类id
    c3Id: '',
    count: 0
  }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})