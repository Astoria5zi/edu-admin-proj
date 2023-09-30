<template>
    <div class="layout_container">

        <!-- 顶部导航 -->
        <div class="layout_header">
            <div class="header_block">
                <Header></Header>
            </div>

        </div>
        <!-- 主体部分 -->
        <div class="layout_body">
            <Main></Main>>
        </div>

        <!-- 底部导航 -->
        <div class="layout_footer">
            <Footer></Footer>
        </div>


    </div>
</template>
  
<script setup lang='ts'>
import Main from '@/layout/layout_main/index.vue'
</script>
  
<style lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;
    // background-color: #bfa;
    flex-direction: column;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .layout_header {
        margin: 0 auto;
        width: 80%;
    }

    .layout_body {
        margin: 0 auto;
        width: 80%;
    }

    .layout_footer {
        width: 100%;
        background-color: #333;
    }

}
</style>