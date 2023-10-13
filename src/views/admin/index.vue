<template>
	<div class="common-layout">
		<el-container>
			<!-- 侧边栏 -->
			<el-aside :class="{ fold: LayoutSettingStore.fold ? true : false }">
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

import tabbar from './components/Tabbar/index.vue'
import adminmenu from './components/AdminMenu/index.vue'
// 获取Layout相关的配置仓库
import useLayOutSettingStore from '@/store/setting'
import { onMounted, onUnmounted } from 'vue';
let LayoutSettingStore = useLayOutSettingStore();

// 流媒体查询
const handleResize = () => {
	// 用于检查窗口宽度是否小于等于 768 像素。
	LayoutSettingStore.fold = window.matchMedia("(max-width: 768px)").matches;
};

onMounted(() => {
	handleResize(); // 初始化时执行一次以设置初始的fold值
	window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
});

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
			transition: width 0.2s ease-in;
			overflow-x: hidden;

			&.fold {
				width: $base-menu-min-width;
			}

			@media screen and (max-width: 768px) {
				/* 在屏幕宽度小于等于768像素时应用的CSS样式 */
				width: $base-menu-min-width;
			}
		}


		.el-header {
			height: $base-tabbar-height;
			width: 100%;
			// background-color: skyblue;

		}

		.el-main {
			padding: 0 10px;

			.el-card {
				height: calc(100vh - $base-tabbar-height);
				width: 100%;
				background-color: rgb(250, 250, 250);
				overflow: auto
			}
		}

	}

}
</style>
