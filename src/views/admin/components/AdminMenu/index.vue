<template>
	<!-- 左侧菜单组件 -->
	<el-menu router active-text-color="#ffd04b" background-color="$base-menu-background" class="el-menu-vertical-demo"
		default-active="/admin/home" text-color="#fff">
		<!-- 首页 -->
		<el-menu-item index="/admin/home">
			<el-icon>
				<Histogram />
			</el-icon>
			<span>首页</span>
		</el-menu-item>

		<!-- 学生管理 -->
		<el-menu-item index="/admin/student">
			<el-icon>
				<User />
			</el-icon>
			<span>学生管理</span>
		</el-menu-item>

		<!-- 教师管理 -->
		<el-menu-item index="/admin/teacher">
			<el-icon>
				<Avatar />
			</el-icon>
			<span>教师管理</span>
		</el-menu-item>

		<!-- 课程管理 -->
		<el-menu-item index="/admin/course">
			<el-icon>
				<Reading />
			</el-icon>
			<span>课程管理</span>
		</el-menu-item>
	</el-menu>
</template>
    
<script setup lang='ts'>
console.log();

</script>
    
<style scoped lang="scss">
.el-menu {
	border: none;
}
</style>