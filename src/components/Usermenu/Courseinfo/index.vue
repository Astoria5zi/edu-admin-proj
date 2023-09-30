<template>
    <div class="courses">
        <img src="@/static/images/Banner/iot.jpg" alt="">
        <div class="text-zone">
            <h1>计算机知识培训</h1>
            <div class="study-progress">学习至:XXXXXXXXX</div>
            <div class="sum-progress">总进度:15%</div>
        </div>
        <el-button type="primary" size="default" @click="">继续学习</el-button>
    </div>
</template>
<script setup lang="ts">

</script>


<style scoped lang="scss">
.courses {
    // background-color: palegreen;
    height: 100px;
    display: flex;
    align-items: center;
    background-color: rgb(249, 249, 251);
    margin: 5px 0;
    border-radius: 10px;
    padding: 10px;


    img {
        width: 20%;
        height: 100%;
        border-radius: 5px;

    }

    .text-zone {
        padding-left: 20px;
        height: 100%;
        width: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // background-color: palegreen;

        h1 {
            color: #999;
            font-size: 18px;

        }

        div {
            color: #999;
            font-size: 14px;
        }


    }

}
</style>
