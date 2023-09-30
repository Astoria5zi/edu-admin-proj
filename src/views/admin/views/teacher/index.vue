<template>
	<!-- 展示教师列表以及操作 -->
	<div v-if="!isAdd" class="teacher-table">
		<!-- 搜索框 -->
		<el-input placeholder="输入教师姓名" :suffix-icon="Search" style="width: 200px ;" v-model="keyWords" />

		<!-- 添加教师按钮 -->
		<el-button type="primary" size="default" @click="isAdd = true" style="margin: 10px;">添加教师</el-button>

		<!-- 展示教师列表 -->
		<el-table :data="computedTeachersArr" border style="width: 100%">
			<el-table-column label="序号" type="index" algin="center" width="80"></el-table-column>
			<el-table-column prop="id" label="编号" width="80" />
			<el-table-column prop="name" label="姓名" width="80" />
			<el-table-column prop="intro" label="个人简介" />
			<el-table-column prop="resume" label="职称" width="80" />
			<el-table-column prop="pic" label="证件照" />

			<el-table-column label="操作" width="250">
				<template #="{ row }">
					<el-button type="primary" size="small" @click="" icon="Plus" title="添加SKU"></el-button>
					<el-button type="primary" size="small" @click="editTeacher(row.id)" icon="Edit"
						title="修改教师"></el-button>
					<el-button type="primary" size="small" @click="" icon="Search" title="查看SKU"></el-button>
					<el-button type="danger" size="small" @click="removeTeacher(row.id)" icon="Delete"
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



	<!-- 添加教师界面 -->
	<div v-if="isAdd" class="add-container">
		<el-form :model="newTeacher" ref="form" label-width="120px" :inline="false" style="max-width: 460px">
			<el-form-item label="教师姓名：">
				<el-input v-model="newTeacher.username"></el-input>
			</el-form-item>

			<el-form-item label="教师职称：">
				<el-select placeholder="please select your level" v-model="newTeacher.resume">
					<el-option label="讲师" value="讲师" />
					<el-option label="副教授" value="副教授" />
					<el-option label="教授" value="教授" />
				</el-select>
			</el-form-item>

			<el-form-item label="教师性别：">
				<el-radio-group v-model="newTeacher.sex">
					<el-radio label="1">男</el-radio>
					<el-radio label="0">女</el-radio>
				</el-radio-group>
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
				<el-button v-if="editFlag" type="primary" @click="onEdit">修改</el-button>
				<el-button v-else type="primary" @click="onSubmit">新增</el-button>
				<el-button @click="isAdd = false">取消</el-button>
			</el-form-item>

		</el-form>

	</div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue';
// 获取教师相关接口
import { reqGetTeacherList, reqDeleteTeacher, reqAddTeacher, reqGetTeacherByID, reqEditTeacher } from '@/api/teacher'


// 当前页码
let pageNo = ref(1)
// 页码大小
let pageSize = ref(5)
// 教师总数量
let total = ref(0)
// 是否点击添加教师
let isAdd = ref(false)
// 存储教师列表
let teachersArr = ref([])
// 搜索框关键字
let keyWords = ref('')
// 计算属性教师列表
const computedTeachersArr = computed(() => {
	return teachersArr.value.filter((item: any) => {
		return item.name.includes(keyWords.value)
	})
})
// 定义标志判断是修改还是新增
let editFlag = ref(false)

// 封装获取教师信息方法
const getTeachers = async () => {
	let result = await reqGetTeacherList(pageNo.value, pageSize.value)

	teachersArr.value = result.items
	total.value = result.counts
}

// 组件挂载时获取教师信息
onMounted(() => {
	getTeachers()

})

// 删除按钮回调
const removeTeacher = async (id: number) => {
	// 调用删除接口
	await reqDeleteTeacher(id)
	// 重新获取教师信息
	await getTeachers()
}

// 当前页面改变触发回调
const handleCurrentChange = () => {
	// 重新发请求获取教师信息
	getTeachers()
}

// 页面大小改变触发回调
const handleSizeChange = () => {
	// 重新发请求获取教师信息
	getTeachers()
}

// 修改教师按钮回调
const editTeacher = async (id: number) => {
	// 打开修改标志
	editFlag.value = true
	// 获取该id对应教师信息
	let result = await reqGetTeacherByID(id)
	// 跳转到表单页面
	isAdd.value = true
	// 教师信息添加到表单
	Object.assign(newTeacher, result)
	newTeacher.username = newTeacher.name
	console.log(newTeacher);
}

// 确认修改按钮回调
const onEdit = async () => {
	// 真不是我想这样写，接口那里一个名字有name和username两个字段，人都被搞混了，反正现在这样能正常用
	newTeacher.name = newTeacher.username
	// 发起修改请求
	await reqEditTeacher(newTeacher)
	// 修改成功重新获取教师信息
	getTeachers()
	// 关闭修改标志
	editFlag.value = false
	// 返回表格界面
	isAdd.value = false
}




// 表单对象
let newTeacher = reactive({
	utype: '101002', // 教师类型  必要
	name: '',  // 必要
	username: '',// 必要
	sex: '',// 必要
	intro: '',
	resume: '',
	userpic: '',

})

// 确认添加按钮回调
const onSubmit = async () => {
	// 返回教师列表
	isAdd.value = false
	newTeacher.name = newTeacher.username
	// 发起添加教师请求
	await reqAddTeacher(newTeacher)
	// 重新获取教师列表
	getTeachers()
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
