<template>
    <el-card :body-style="{ padding: '0px' }" shadow="always">
        <img :src="courseImg"
            class="image" />
        <div class="text-zone">
            <span class="zone_big_text">{{ props.courseName }}</span>
            <span class="zone_small_text">免费</span>
        </div>
    </el-card>
</template>
  
<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { defineProps } from 'vue';


let props = defineProps(["courseName","courseImg"]);
onMounted(() => {
    console.log(props.courseName);
})


</script>
  
<style lang="scss" scoped>
.el-card {

    margin: 20px 0;
    display: flex;
    justify-content: center;
    img{
        width: 100%;
    }

    .text-zone {
        margin: 5px 0;
        height: 30px;

        .zone_big_text {
            font-size: 16px;
            margin-top: 5px;
            padding: 0 10px;
            word-break: break-all;
        }

        .zone_small_text {
            font-size: 14px;
            color: #999;
            margin-top: 10px;
            margin-left: 10px;
            vertical-align: baseline;
        }

    }

}
</style>