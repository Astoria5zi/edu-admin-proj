<template>
    <!-- 顶部导航 -->
    <Header></Header>
    <!-- 课程列表 -->
    <div class="course_nav">
        <!-- 一级分类 -->
        <el-tabs v-model="c1Id" class="demo-tabs" @tab-click="handleClick1">
            <el-tab-pane label="全部" :name="0">
            </el-tab-pane>
            <el-tab-pane label="前端" :name="2">
            </el-tab-pane>
            <el-tab-pane label="后端" :name="3">
            </el-tab-pane>
            <el-tab-pane label="物联网" :name="4">
            </el-tab-pane>
            <el-tab-pane label="电子信息" :name="5">
            </el-tab-pane>
        </el-tabs>

        <!-- 二级分类 -->
        <el-tabs v-show="c1Id" v-model="c2Id" class="demo-tabs" @tab-click="handleClick2">
            <el-tab-pane label="全部" :name="0">

            </el-tab-pane>
            <el-tab-pane label="前端" :name="2">

            </el-tab-pane>
            <el-tab-pane label="后端" :name="3">

            </el-tab-pane>
            <el-tab-pane label="物联网" :name="4">

            </el-tab-pane>
            <el-tab-pane label="电子信息" :name="5">

            </el-tab-pane>
        </el-tabs>

        <!-- 三级分类 -->
        <el-tabs v-show="c1Id && c2Id" v-model="c3Id" class="demo-tabs" @tab-click="handleClick3">
            <el-tab-pane label="全部" :name="0">

            </el-tab-pane>
            <el-tab-pane label="前端" :name="2">

            </el-tab-pane>
            <el-tab-pane label="后端" :name="3">

            </el-tab-pane>
            <el-tab-pane label="物联网" :name="4">

            </el-tab-pane>
            <el-tab-pane label="电子信息" :name="5">

            </el-tab-pane>
        </el-tabs>

        <!-- 是否免费 -->
        <el-tabs v-model="isFree" class="demo-tabs" @tab-click="handleClick4">
            <el-tab-pane label="全部" name="1"></el-tab-pane>
            <el-tab-pane label="免费" name="2"></el-tab-pane>
            <el-tab-pane label="收费" name="3"></el-tab-pane>
        </el-tabs>
    </div>

    <!-- 展示课程区域 -->
    <div class="course-zone">
        <el-row :gutter="10">
            <el-col :span="6" v-for="item in courseList">
                <!-- <script>console.log(item)</script> -->
                <card :courseName="item.name" :courseImg="item.pic"></card>
            </el-col>
        </el-row>
    </div>



    <!-- 底部导航 -->
    <Footer></Footer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { reqCourseList } from '@/api/course/index'
import card from '@/components/card/index.vue'



// 保存一级分类ID
let c1Id = ref(0)
// 保存二级分类ID
let c2Id = ref(0)
// 保存三级分类ID
let c3Id = ref(0)
// 是否免费
let isFree = ref(0)
// 存储所有课程信息
let courseList = ref([
    // {
    //     "id": 25,
    //     "companyId": 1232141425,
    //     "companyName": null,
    //     "name": "Bootstrap开发框架",
    //     "users": "Bootstrap是由Twitter推出的一个前台页面开发框架，在行业之中使用较为广泛。此开发框架包含了大量的CSS、JS程序代码，可以帮助开发者（尤其是不擅长页面开发的程序人员）轻松的实现一个不受浏览器限制的精美界面效果。",
    //     "tags": null,
    //     "mt": "1-1",
    //     "st": "1-1-1",
    //     "grade": "200002",
    //     "teachmode": "200002",
    //     "description": "Bootstrap是由Twitter推出的一个前台页面开发框架，在行业之中使用较为广泛。此开发框架包含了大量的CSS、JS程序代码，可以帮助开发者（尤其是不擅长页面开发的程序人员）轻松的实现一个不受浏览器限制的精美界面效果。",
    //     "pic": "/mediafiles/2022/12/18/c051fe97e672dd399902a90f4ac67962.jpg",
    //     "createDate": "2019-09-04T09:56:19",
    //     "changeDate": "2022-12-18T12:14:49",
    //     "createPeople": null,
    //     "changePeople": null,
    //     "auditStatus": "202002",
    //     "status": "203001"
    // },
    // {
    //     "id": 26,
    //     "companyId": 1232141425,
    //     "companyName": null,
    //     "name": "spring cloud实战",
    //     "users": "所有人",
    //     "tags": null,
    //     "mt": "1-3",
    //     "st": "1-3-2",
    //     "grade": "200003",
    //     "teachmode": "200002",
    //     "description": "本课程主要从四个章节进行讲解： 1.微服务架构入门 2.spring cloud 基础入门 3.实战Spring Boot 4.注册中心eureka。",
    //     "pic": "https://cdn.educba.com/academy/wp-content/uploads/2018/08/Spring-BOOT-Interview-questions.jpg",
    //     "createDate": "2019-09-04T09:56:19",
    //     "changeDate": "2021-12-26T22:10:38",
    //     "createPeople": null,
    //     "changePeople": null,
    //     "auditStatus": "202002",
    //     "status": "203001"
    // },
    // {
    //     "id": 25,
    //     "companyId": 1232141425,
    //     "companyName": null,
    //     "name": "Bootstrap开发框架",
    //     "users": "Bootstrap是由Twitter推出的一个前台页面开发框架，在行业之中使用较为广泛。此开发框架包含了大量的CSS、JS程序代码，可以帮助开发者（尤其是不擅长页面开发的程序人员）轻松的实现一个不受浏览器限制的精美界面效果。",
    //     "tags": null,
    //     "mt": "1-1",
    //     "st": "1-1-1",
    //     "grade": "200002",
    //     "teachmode": "200002",
    //     "description": "Bootstrap是由Twitter推出的一个前台页面开发框架，在行业之中使用较为广泛。此开发框架包含了大量的CSS、JS程序代码，可以帮助开发者（尤其是不擅长页面开发的程序人员）轻松的实现一个不受浏览器限制的精美界面效果。",
    //     "pic": "/mediafiles/2022/12/18/c051fe97e672dd399902a90f4ac67962.jpg",
    //     "createDate": "2019-09-04T09:56:19",
    //     "changeDate": "2022-12-18T12:14:49",
    //     "createPeople": null,
    //     "changePeople": null,
    //     "auditStatus": "202002",
    //     "status": "203001"
    // },
    // {
    //     "id": 26,
    //     "companyId": 1232141425,
    //     "companyName": null,
    //     "name": "spring cloud实战",
    //     "users": "所有人",
    //     "tags": null,
    //     "mt": "1-3",
    //     "st": "1-3-2",
    //     "grade": "200003",
    //     "teachmode": "200002",
    //     "description": "本课程主要从四个章节进行讲解： 1.微服务架构入门 2.spring cloud 基础入门 3.实战Spring Boot 4.注册中心eureka。",
    //     "pic": "https://cdn.educba.com/academy/wp-content/uploads/2018/08/Spring-BOOT-Interview-questions.jpg",
    //     "createDate": "2019-09-04T09:56:19",
    //     "changeDate": "2021-12-26T22:10:38",
    //     "createPeople": null,
    //     "changePeople": null,
    //     "auditStatus": "202002",
    //     "status": "203001"
    // },

])


// 获取一级分类的方法
const getC1 = () => {

}

// 获取二级分类的方法
const getC2 = (c1Id) => {

}

// 获取三级分类的方法
const getC3 = (c2Id) => {

}

// 根据分类+是否免费条件获取课程方法


// 点击标签1回调
const handleClick1 = (tab: TabsPaneContext) => {
    // 获取点击的一级id
    c1Id.value = tab.props.name as number

    // if(c1Id.value)

    // // 发送请求，获取所有带有该一级id的课程
    // console.log(c1Id.value);

}
// 点击标签2回调
const handleClick2 = (tab: TabsPaneContext) => {
    c2Id.value = tab.props.name as number
}
// 点击标签3回调
const handleClick3 = (tab: TabsPaneContext) => {
    c2Id.value = tab.props.name as number
}
// 点击标签4回调
const handleClick4 = (tab: TabsPaneContext) => {
    c2Id.value = tab.props.name as number
}

// 组件挂载时发请求获取所有一级分类标签
onMounted(async () => {
    const data: any = {
        pageNo: 1,
        pageSize: 10,
        queryCourseParamsDto: {
            "auditStatus": "202002",
            "courseName": ""
        }
    }
    let result = await reqCourseList(data)
    courseList.value = result.items


})



</script>


<style scoped lang="scss">
.course_nav {
    margin-top: 10px;
    width: 80%;
    // background-color: pink;
}

.course-zone {
    width: 80%;
}
</style>
