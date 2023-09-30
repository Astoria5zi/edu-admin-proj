<template>
	<div class="common-layout">
		<el-container>
			<!-- 侧边栏 -->
			<el-aside>
				<!-- LOGO部分 -->
				<logo></logo>
				<!-- 菜单部分 -->
				<adminmenu></adminmenu>
			</el-aside>


			<el-container>
				<!-- 顶部导航 -->
				<el-header>
					<tabbar></tabbar>
				</el-header>
				<!-- 展示区域 -->
				<el-main>
					<el-card shadow="never" :body-style="{ padding: '10px', height: '100%' }">
						<router-view></router-view>
					</el-card>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script setup lang="ts">
import logo from './components/Logo/index.vue'
import tabbar from './components/Tabbar/index.vue'
import adminmenu from './components/AdminMenu/index.vue'

</script>


<style scoped lang="scss">
.common-layout {
	height: 100vh;
	width: 100%;
	// background-color: pink;

	.el-container {
		width: 100%;

		.el-aside {
			color: #fff;
			width: $base-menu-width;
			height: 100vh;
			background-color: $base-menu-background;
		}


		.el-header {
			height: $base-tabbar-height;
			width: 100%;
			// background-color: skyblue;

		}

		.el-card {
			height: 100%;
			width: 100%;
			background-color: rgb(250, 250, 250);
			// background-color: #bcf;

		}
	}

}
</style>
