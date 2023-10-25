<template>
  <!-- 顶部导航 -->
  <Header></Header>

  <div class="login_container">

    <el-card class="box-card" body-style="padding:0px">
      <el-row>
        <el-col :span="12">
          <div class="aside_img">

          </div>
        </el-col>
        <el-col :span="12">
          <el-form class="login_form" :model="userLoginDTO"  style="width: 420px"  label-width="200px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="userLoginDTO.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" show-password v-model="userLoginDTO.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="login_btn" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

  </div>
  <!-- 底部导航 -->
  <Footer></Footer>
</template>

<script setup lang='ts'>
import { reactive } from 'vue';
import { ElNotification } from 'element-plus';
// 引入用户小仓库
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
let userStore = useUserStore()
// 获取路由器
let $router = useRouter()


// 账号密码数据
let userLoginDTO = reactive({ password: '123456', username: '郭行骞2' })

// 点击登录触发回调
const login = async () => {
  await userStore.userLogin(userLoginDTO)
  // 跳转到主页
  $router.push({ path: '/' })
  // 登陆成功提示信息
  ElNotification({
    type: 'success',
    title: `hi,${getTime()}好`,
    message: '欢迎回来'
  })
}

// 获取时间
const getTime = () => {
  let message = ''
  let hours = new Date().getHours()
  if (hours <= 9) {
    message = '早上'
  } else if (hours <= 12) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}


</script>

<style lang="scss" scoped>
.login_container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: rgb(34, 86, 247);

  .box-card {
    width: 70%;
    height: 45vh;
    padding: 0px;
    margin: 0px;
    border-radius: 20px;

    .aside_img {
      height: 45vh;

      background: url('@/static/images/Login/bcg.png') no-repeat;
      background-size: cover;
    }

    .login_form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 45vh;
    }
  }


}
</style>