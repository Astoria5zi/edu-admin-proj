<template>
    <div class="logo">
        <img src="@/static/images/LOGO/logo.png" alt="">
        <p>xxxx教育培训管理系统</p>
    </div>
</template>
    
<script setup lang='ts'>

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