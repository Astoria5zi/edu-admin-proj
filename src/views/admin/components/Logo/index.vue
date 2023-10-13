<template>
    <div class="logo">
        <img src="@/static/images/LOGO/logo2.png" alt="">
        <p v-if="!LayoutSettingStore.fold">教育培训管理系统</p>
    </div>
</template>
    
<script setup lang='ts'>
// 获取Layout相关的配置仓库
import useLayOutSettingStore from '@/store/setting'
let LayoutSettingStore = useLayOutSettingStore();
</script>
    
<style scoped lang="scss">
.logo {
    height: $base-menu-logo-height;
    display: flex;
    align-items: center;
    width: 100%;
    color: white;
    padding: 10px;

    img {
        height: 40px;
        width: 40px;
    }

    p {
        font-size: $base-logo-title-fontSize;
        margin-left: 10px;
    }
}
</style>