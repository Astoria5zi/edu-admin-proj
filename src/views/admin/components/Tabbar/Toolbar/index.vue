<template>
	<div class="tabbar-right">
		<el-menu router class="el-menu-demo" mode="horizontal" :ellipsis="false" style="border: none;">
			<el-menu-item index="/" style="border: none;">回到主页</el-menu-item>
			<el-menu-item index="/userpage" v-if="userStore.isLogin" >
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
		</el-menu>




	</div>
</template>
    
<script setup lang='ts'>

// 引入用户仓库
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
// 获取路由器
let $router = useRouter()
let userStore = useUserStore()

// 退出登录按钮回调
const unLogin = async () => {
	await userStore.userLogout()
	// 跳转到主页
	$router.push({ path: '/login' })

}

</script>
    
<style scoped lang="scss">
.tabbar-right {
	display: flex;
	align-items: center;
	justify-content: center;
	

	.el-menu-demo {
		display: flex;
		align-items: center;
		height: $base-tabbar-height;
	}
}
</style>