<template>
    <!-- 顶部导航栏组件 -->
    <div class="tabbar">
        <!-- 左侧面包屑 -->
        <breadcrumb></breadcrumb>
        <!-- 右侧头像工具栏 -->
        <toolbar></toolbar>
    </div>
</template>
    
<script setup lang='ts'>
import breadcrumb from './Breadcrumb/index.vue'
import toolbar from './Toolbar/index.vue'
</script>
    
<style scoped lang="scss">
.tabbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}
</style>