// layout组件相关配置仓库
import { defineStore } from "pinia";

let useLayOutSettingStore = defineStore('SettingStore', {
    state: () => {
        return {
            fold: false,

        }
    },
})

export default useLayOutSettingStore