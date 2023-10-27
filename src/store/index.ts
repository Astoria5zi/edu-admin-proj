// 大仓库
import { createPinia } from "pinia";

// 引入pinia持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

let pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
// 对外暴露大仓库
export default pinia