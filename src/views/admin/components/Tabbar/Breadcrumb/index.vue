<template>
	<!-- 面包屑组件 -->
	<el-breadcrumb :separator-icon="ArrowRight">

		<el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
			<span style="margin:0px 5px">{{ item.meta.title }}</span>
		</el-breadcrumb-item>
	</el-breadcrumb>
</template>
    
<script setup lang='ts'>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
// 获取路由对象
let $route = useRoute()




</script>
    
<style scoped lang="scss"></style>