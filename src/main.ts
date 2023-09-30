import { createApp } from 'vue'
import App from './App.vue'
// 获取应用实例对象
const app = createApp(App)

// 安装elment -ui
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// 引入路由
import router from './router'

// 引入模板的全局样式
import '@/styles/index.scss'

// 引入全局组件
import Header from '@/components/header/index.vue'
import Footer from '@/components/footer/index.vue'

// 引入仓库
import pinia from './store';
app.use(pinia)

// 引入video.js视频组件
import "video.js/dist/video-js.css";

// 引入echarts
import echarts from '@/utils/echarts'
app.config.globalProperties.echarts = echarts;



// 安装插件
app.use(ElementPlus, {
  locale: zhCn
})


// 注册全局组件
app
  .component('Header', Header)  // 顶部组件
  .component('Footer', Footer)


// 注册路由
app.use(router)
// 挂载应用
app.mount('#app')