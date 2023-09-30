<template>
    <div class="banner">
        <!-- 海报轮播 -->
        <el-carousel class="banner-carousel">
            <el-carousel-item v-for="item in img_arr" :key="item">
                <img :src="item" alt="">
            </el-carousel-item>
        </el-carousel>

        <!-- 海报上的导航栏 -->
        <div class="nav">
            <el-menu class="el-menu-vertical-demo" text-color="#fff" active-text-color="#fff">
                <el-menu-item index="1">
                    <span>Java全栈工程师</span>
                </el-menu-item>
                <el-menu-item index="2">
                    <span>大数据AI智慧工程师</span>
                </el-menu-item>
                <el-menu-item index="3">
                    <span>前端智能开发工程师</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <span>嵌入式物联网</span>
                </el-menu-item>
                <el-menu-item index="5">
                    <span>集成电路工程师</span>
                </el-menu-item>
            </el-menu>
        </div>


    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
// 引入图片数组
import img1 from '@/static/images/Banner/ai-2.jpg'
import img2 from '@/static/images/Banner/bigdata23.jpg'
import img3 from '@/static/images/Banner/iot.jpg'
import img4 from '@/static/images/Banner/jichu-java-12.jpg'
// 存储数组
const img_arr = ref([
    img1, img2, img3, img4

])



</script>

<style lang="scss" scoped>
.banner {
    position: relative;
    width: 100%;
    height: 300px;

    .banner-carousel {
        margin-top: 20px;
        width: 100%;
        height: 100%;
        position: relative;

        img {
            height: 100%;
            width: 100%;
        }
    }

    .nav {
        position: absolute;
        top: 0;
        left: 100px;
        height: 100%;
        min-width: 200px;
        width: 15%;

    }

    .el-menu-vertical-demo {
        background-color: rgba($color: #333, $alpha: 0.6);
        height: 100%;

        .el-menu-item {
            height: 20%;
        }

        .el-menu-item:hover {
            background-color: rgba($color: #333, $alpha: 0.6);
        }
    }
}
</style>
