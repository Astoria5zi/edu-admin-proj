<template>
	<!-- 展示教师列表以及操作 -->
	<div v-if="!isAdd" class="teacher-table">
		<!-- 搜索框 -->
		<el-input placeholder="输入课程名称" :suffix-icon="Search" style="width: 200px ;" v-model="keyWords"
			 />

		<!-- 添加课程按钮 -->
		<el-button type="primary" size="default" @click="isAdd = true" style="margin: 10px;">添加课程</el-button>

		<!-- 展示教师列表 -->
		<el-table :data="computedCoursesArr" border style="width: 100%" max-height="650">
			<el-table-column label="序号" type="index" algin="center" width="60"></el-table-column>
			<el-table-column prop="id" label="ID" width="60"></el-table-column>
			<el-table-column prop="name" label="课程名称" width="180" />
			<el-table-column prop="description" label="课程简介" show-overflow-tooltip />
			<el-table-column prop="createPeople" label="授课教师" width="120" show-overflow-tooltip />
			<el-table-column prop="users" label="适合人群" width="120" show-overflow-tooltip />
			<el-table-column prop="status" label="课程状态" width="100" />
			<el-table-column prop="pic" label="课程封面" width="120" show-overflow-tooltip />

			<el-table-column label="操作" width="230">
				<template #="{ row }">
					<el-button type="primary" size="small" @click="" icon="Plus" title="添加SKU"></el-button>
					<el-button type="primary" size="small" @click="" icon="Edit" title="修改SPU"></el-button>
					<el-button type="primary" size="small" @click="" icon="Search" title="查看SKU"></el-button>
					<el-button type="danger" size="small" @click="removeCourse(row.id)" icon="Delete"
						title="删除SPU"></el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页器 -->
		<div class="demo-pagination-block" style="margin: 10px 0;">
			<el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 40]"
				:background="true" layout="total, sizes, prev, pager, next, jumper" :total="total"
				@size-change="handleSizeChange" @current-change="handleCurrentChange" />
		</div>
	</div>

	<!-- 添加课程界面 -->
	<div v-if="isAdd" class="add-container">
		<el-form :model="newTeacher" ref="form" label-width="120px" :inline="false" style="max-width: 460px">
			<el-form-item label="教师姓名：">
				<el-input v-model="newTeacher.name"></el-input>
			</el-form-item>
			<el-form-item label="教师职称：" v-model="newTeacher.resume">
				<el-select placeholder="please select your level">
					<el-option label="讲师" value="lecturer" />
					<el-option label="副教授" value="associate" />
					<el-option label="教授" value="professor" />
				</el-select>
			</el-form-item>
			<el-form-item label="教师简介：">
				<el-input type="textarea" v-model="newTeacher.intro" />
			</el-form-item>
			<el-form-item label="教师照片：">
				<el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
					:show-file-list="false">
					<img v-if="false" class="avatar" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="onSubmit">添加教师</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>

	</div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, onMounted, reactive, ref, watch } from 'vue';

// 获取课程相关接口
import { reqCourseList } from '@/api/course';


// 当前页码
let pageNo = ref(1)
// 页码大小
let pageSize = ref(5)
// 教师总数量
let total = ref(0)
// 是否点击添加教师
let isAdd = ref(false)
// 存储课程列表
let coursesArr = ref([])
// 搜索框关键字
let keyWords = ref('')
// 计算属性课程列表
const computedCoursesArr = computed(() => {
	return coursesArr.value.filter((item: any) => {
		return item.name.includes(keyWords.value)
	})
})

// 封装获取课程方法
const getCourses = async () => {
	let result = await reqCourseList(pageNo.value, pageSize.value, {
		"auditStatus": "",
		"courseName": ""
	})

	coursesArr.value = result.items
	total.value = result.counts

}

// 组件挂载时获取教师信息
onMounted(() => {
	getCourses()
})

// 搜索框关键字发生变化
watch(computedCoursesArr, () => {
	console.log(computedCoursesArr.value);
	
})

// 删除按钮回调
const removeCourse = async (id: number) => {
	// 发起删除请求
	console.log(id);
}

// 当前页面改变触发回调
const handleCurrentChange = () => {
	getCourses()
}

// 页面大小改变触发回调
const handleSizeChange = () => {
	getCourses()
}




/******** 新增教师相关方法 *********/

// 表单对象
let newTeacher = reactive({
	name: '',
	intro: '',
	resume: '',
	pic: '',
	utype: '101002' // 教师类型
})

// 确认添加按钮回调
const onSubmit = async () => {
	// 返回教师列表
	isAdd.value = false

	// 发起添加教师请求
	let result = await reqAddTeacher(newTeacher)
	console.log(result);

}




</script>


<style scoped lang="scss">
.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
	// background-color: #bcf;
}
</style>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
