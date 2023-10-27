<template>
  <div class="header">

    <img class="LOGO" src="@/static/images/LOGO/10.png" alt="">
    
    <el-menu router class="el-menu-demo" mode="horizontal" style="margin: 0 ;" text-color="#333" active-text-color="#333">
      <div class="tab_left">

        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/courselist">课程</el-menu-item>
        <el-menu-item index="/admin">管理中心</el-menu-item>
      </div>

      <div class="demo-input-size">
        <el-input v-model="text" size="large" placeholder="Please Input" :suffix-icon="Search" style="width: 400px ;" />
      </div>

      <div class="tab_right">
       
        <!-- 根据是否有TOKEN决定是否展示头像 -->
        <el-menu-item index="/userpage" v-if="userStore.userInfo.userpic">
          <el-avatar :src="userStore.userInfo.userpic" />
          <el-dropdown>
            <span class="el-dropdown-link">
              个人中心
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="unLogin">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-menu-item>
        <el-menu-item index="/login" v-else>登录 | 注册</el-menu-item>
        <!-- <el-menu-item index="/userpage">个人中心</el-menu-item> -->
      </div>
    </el-menu>
  </div>
  <el-divider style="margin: 0;margin-top: 5px;" />
</template>
  
<script setup lang='ts'>

import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 获取路由器
let $router = useRouter()
// 引入用户仓库
import useUserStore from '@/store/user';
let userStore = useUserStore()
// 定义搜索框内容
let text = ref()

// 退出登录按钮回调
const unLogin = async () => {
  await userStore.userLogout()
  // 跳转到主页
  $router.push({ path: '/login' })

}

</script>
  
<style lang="scss">
.header {

  margin: 0 auto;
  width: 80%;
  height: $base-header-height;
  display: flex;
  align-items: center;
  justify-content: center;

  .LOGO {
    width: 180px;
  }

  .el-menu-demo {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: none;

    .tab_left {
      display: flex;
      flex-direction: row;
      justify-content: center;


    }

    .tab_right {
      display: flex;
      flex-direction: row;
      // background-color: pink;


    }

    .el-menu-item:hover {
      background-color: none;
    }
  }


}
</style>