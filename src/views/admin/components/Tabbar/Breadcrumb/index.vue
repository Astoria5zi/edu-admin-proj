<template>
	<div style="display: flex;">
		<!-- 控制是否折叠 -->
		<el-icon style="margin-right: 10px;" @click="changeIcon">
			<component :is=" LayoutSettingStore.fold?'Fold':'Expand'"></component>
		</el-icon>

		<!-- 面包屑组件 -->
		<el-breadcrumb :separator-icon="ArrowRight">

			<el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title"
				:to="item.path">
				<span style="margin:0px 5px">{{ item.meta.title }}</span>
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>
    
<script setup lang='ts'>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
// 获取路由对象
let $route = useRoute()
// 获取Layout相关的配置仓库
import useLayOutSettingStore from '@/store/setting'
let LayoutSettingStore = useLayOutSettingStore();

// 点击图标的方法
const changeIcon = () => {
	LayoutSettingStore.fold = !LayoutSettingStore.fold
}

</script>
    
<style scoped lang="scss"></style>