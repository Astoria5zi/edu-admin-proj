<template>
    <div class="tabbar-right">
        <el-avatar :icon="UserFilled" />
        <el-dropdown style="margin-left: 10px;">
            <span class="el-dropdown-link">
                admin<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu >
                    <el-dropdown-item >退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>
    
<script setup lang='ts'>
import { UserFilled } from '@element-plus/icons-vue'

</script>
    
<style scoped lang="scss">
.tabbar-right{
    display: flex;
    align-items: center;
}
</style>