<template>
	<!-- 顶部导航 -->
	<Header></Header>

	<!-- 个人中心内容界面 -->
	<div class="common-layout">
		<el-container>
			<!-- 左侧菜单 -->
			<el-aside width="200px">
				<el-menu default-active="1" class="el-menu-vertical-demo">
					<el-menu-item v-for="item in routes" @click="goRoute" :index="item.path">
						<span>{{ item.meta.title }}</span>
					</el-menu-item>
					<!-- <el-menu-item v-for="item in menu" @click="goRoute" :index="item.menuURL">	
						<span>{{item.menuName}} </span>
					</el-menu-item> -->
				</el-menu>
			</el-aside>

			<!-- 右侧主体部分 -->
			<el-main>
				<router-view></router-view>
			</el-main>


		</el-container>
	</div>

	<!-- 底部导航 -->
	<Footer></Footer>
</template>
<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// let menu = ref([{menuName:"个人信息",menuURL:"/userpage/myinfo"},
// {menuName:"个人课程",menuURL:"/userpage/mycourse"},
// {menuName:"个人收藏",menuURL:"/userpage/mystar"},
// {menuName:"我的订单",menuURL:"/userpage/myorder"}]);

// 获取路由器对象
let $router = useRouter()

// 获取当前路由
let $route = useRoute()

// 获取当前路由的子路由
let routes = ref()
onMounted(() => {
	// 纯狗屎代码
	console.log($route.name);
	routes.value = $router.options.routes.find((e: any) => (e.name == "userpage"))?.children;
})

// 点击菜单的回调
const goRoute = (vc: any) => {
	console.log(vc.index);

	$router.push(vc.index)
}

</script>


<style scoped lang="scss">
.common-layout {
	height: calc(100vh - $base-header-height - $base-footer-height);
	width: 80%;

}
</style>
