<template>
    <div class="layout_container">

        <!-- 顶部导航 -->
        <Header></Header>

        <!-- 主体部分 -->
        <div class="layout_body">
            <!-- 轮播图 -->
            <Banner></Banner>
            <!-- 课程卡片 -->
            <Card></Card>
            <CourseCard></CourseCard>
            <CourseCard></CourseCard>
            <CourseCard></CourseCard>
        </div>

        <!-- 底部导航 -->
        <Footer></Footer>
    </div>
</template>
  
<script setup lang='ts'>
// import Main from '@/layout/layout_main/index.vue'
import Banner from '@/components/Banner/index.vue'
import CourseCard from '@/components/CourseCard/index.vue'
import Card from '@/components/card/index.vue'


</script>
  
<style lang="scss">
.layout_body {
    margin: 0 auto;
    width: 80%;
}



// .layout_container {
//     width: 100%;
//     height: 100vh;
//     // background-color: #bfa;
//     flex-direction: column;
//     display: flex;
//     align-items: center;
//     box-sizing: border-box;



//     .layout_body {
//         margin: 0 auto;
//         width: 80%;
//     }

//     .layout_footer {
//         width: 100%;
//         background-color: #333;
//     }

// }
</style>