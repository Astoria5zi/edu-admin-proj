<template>
	<!-- 展示教师列表以及操作 -->
	<div v-if="!isAdd" class="teacher-table">
		<!-- 搜索框 -->
		<el-input placeholder="输入教师姓名" :suffix-icon="Search" style="width: 200px ;" v-model="keyWords" clearable
			@clear="handleClear" />
		<!-- 教师查询按钮 -->
		<el-button type="primary" @click="btnInquire" style="margin: 10px 0px 10px 10px">查询</el-button>
		<!-- 添加教师按钮 -->
		<el-button type="primary" size="default" @click="addTeacherBtn" style="margin: 10px;">添加教师</el-button>
		<!-- 展示教师列表 -->
		<el-table :data="teachersArr" border style="width: 100%" max-height="75vh " stripe :show-overflow-tooltip="true">
			<el-table-column label="序号" type="index" algin="center" width="100" align="center"></el-table-column>
			<el-table-column prop="id" label="编号" width="100" align="center" />
			<el-table-column prop="name" label="姓名" width="120" align="center" />
			<el-table-column prop="courseList" label="所授课程" width="320" align="center" >
				<template #="{ row }">				
					<el-tag v-for="item in row.courseList">{{item.courseName}}</el-tag>
					<!-- <span v-for="item in row.courseList">{{item.courseName}}&nbsp;</span> -->
				</template>
			</el-table-column>
			<el-table-column prop="intro" label="个人简介" header-align="center" />
			<el-table-column prop="resume" label="职称" width="150" align="center" />
			<el-table-column prop="pic" label="证件照" width="150" align="center">
				<template #="{ row }">
					<img v-if="row.userpic" class="table-avatar" :src="row.userpic" alt="图片地址失效" />
					<span v-else>暂无教师图片</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" align="center">
				<template #="{ row }">
					<el-button type="primary" size="small" @click="editTeacher(row.id)" icon="Edit"
						title="修改教师"></el-button>
					<el-button type="primary" size="small" @click="searchTeacher(row.id)" icon="Search"
						title="查看教师详情"></el-button>
					<el-popconfirm title="确认删除吗?" @confirm="removeTeacher(row.id)">
						<template #reference>
							<el-button type="danger" size="small" icon="Delete" title="删除教师"></el-button>
						</template>
					</el-popconfirm>
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
		<el-form :model="newTeacher" ref="ruleFormRef" label-width="120px" :inline="false" style="max-width: 460px"
			:rules="rules">
			<el-form-item label="教师姓名：" prop="username">
				<el-input v-model="newTeacher.username"></el-input>
			</el-form-item>
			<el-form-item label="教师职称：" prop="resume">
				<el-select placeholder="please select your level" v-model="newTeacher.resume">
					<el-option v-for="item in resumeOption" :key="item.value" :label="item.lable" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="教师性别：" prop="sex">
				<el-radio-group v-model="newTeacher.sex">
					<el-radio label="1">男</el-radio>
					<el-radio label="0">女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="教师简介：">
				<el-input type="textarea" v-model="newTeacher.intro" />
			</el-form-item>
			<el-form-item label="教师照片：">
				<el-upload class="avatar-uploader" :http-request="uploadPic" :show-file-list="false"
					:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="newTeacher.pic" class="avatar" :src="newTeacher.pic" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button v-if="editFlag" type="primary" @click="onEdit(ruleFormRef)">修改</el-button>
				<el-button v-else type="primary" @click="onSubmit(ruleFormRef)">新增</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>

	</div>

	<!-- 教师详细界面卡片 -->
	<div class="teacherinfo" v-if="teacherInfoFlag" @click="teacherInfoFlag = false">
		<el-card shadow="always" :body-style="{ padding: '20px' }" @click.stop="teacherInfoFlag = true">
			<template #header>
				<div class="card-header">
					<span>教师详情</span>
				</div>
			</template>
			<el-form :model="teacherInfo" ref="form" label-width="100px" :inline="false" style="max-width: 460px"
				label-position="left">
				<el-form-item label="教师名称：">
					<el-input v-model="teacherInfo.name"></el-input>
				</el-form-item>
				<el-form-item label="教师编号：">
					<el-input v-model="teacherInfo.id"></el-input>
				</el-form-item>
				<el-form-item label="教师简介：">
					<el-input type="textarea" v-model="teacherInfo.intro"></el-input>
				</el-form-item>
				<el-form-item label="教师职称：">
					<el-input v-model="teacherInfo.resume"></el-input>
				</el-form-item>
				<el-form-item label="教师照片：" class="demo-image__error">
					<div class="block">
						<el-image :src="teacherInfo.userpic">
							<template #error>
								<div class="image-slot">
									<el-icon><icon-picture /></el-icon>
								</div>
							</template>
						</el-image>
					</div>
				</el-form-item>
			</el-form>
		</el-card>

	</div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { reactive, onMounted, ref } from 'vue';
// 获取教师相关接口
import { reqGetTeacherList, reqDeleteTeacher, reqAddTeacher, reqGetTeacherByID, reqEditTeacher, reqGetTeacherByName } from '@/api/teacher'
// 获取上传文件接口
import { reqUploadFile } from '@/api/common'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { ElMessage, type FormInstance } from 'element-plus'

// 当前页码
let pageNo = ref(1)
// 页码大小
let pageSize = ref(10)
// 教师总数量
let total = ref(0)
// 是否点击添加教师
let isAdd = ref(false)
// 存储教师列表
let teachersArr = ref([])
// 搜索框关键字
let keyWords = ref('')
// 查询教师详细信息的标志
let teacherInfoFlag = ref(false)
// 表单对象
let newTeacher = ref({
	utype: '101002', // 教师类型  必要
	name: '',  // 必要
	username: '',// 必要
	sex: '',// 必要
	intro: '',
	resume: '',
	pic: '',
	userpic: ''

})
// 教师职称配置对象（不这样做会出现修改教师职称时，lable不能改变的bug）
const resumeOption = [
	{ value: '讲师', lable: '讲师' },
	{ value: '副教授', lable: '副教授' },
	{ value: '教授', lable: '教授' }
]
// 教师详细信息
let teacherInfo = ref({
	"id": '',
	"name": "",
	"intro": '',
	"resume": '',
	"userpic": ''
})
// 是否正在按条件查询标志
let isConditonFlag = ref(false)
// 定义标志判断是修改还是新增
let editFlag = ref(false)
// 绑定表单校验对象
const ruleFormRef = ref<FormInstance>()
// 表单校验规则
const rules = reactive({
	resume: [{ required: true, message: '请选择教师职称类型', trigger: 'blur' }],
	name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
	username: [{ required: true, message: '请输入教师名称名', trigger: 'blur' }],
	sex: [{ required: true, message: '请选择教师性别', trigger: 'blur' }],
});

// 封装获取教师信息方法
const getTeachers = async () => {
	let result = await reqGetTeacherList(pageNo.value, pageSize.value)
	teachersArr.value = result.data.items

	total.value = result.data.counts
}
// 封装一个清空对象属性值方法
const clearObj = () => {
	newTeacher.value = {
		utype: '101002', // 教师类型  必要
		name: '',  // 必要
		username: '',// 必要
		sex: '',// 必要
		intro: '',
		resume: '',
		pic: '',
		userpic: ''

	}
}
// 组件挂载时获取教师信息
onMounted(() => {
	getTeachers()

})

// 删除按钮回调
const removeTeacher = async (id: number) => {
	// 调用删除接口
	let result = await reqDeleteTeacher(id)
	if (result.code == 200) {
		ElMessage.success("删除成功")
	}
	// 重新获取教师信息
	await getTeachers()
}

// 当前页面改变触发回调
const handleCurrentChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetTeacherByName(keyWords.value, pageNo.value, pageSize.value)
		teachersArr.value = result.items
	}
	// 否则调用基本获取课程的接口
	else {
		getTeachers();
	}
}

// 页面大小改变触发回调
const handleSizeChange = async () => {
	// 判断当前是否正在按条件查询
	// 如果是，则调用按条件查询课程的接口
	if (isConditonFlag.value) {
		let result = await reqGetTeacherByName(keyWords.value, pageNo.value, pageSize.value)
		teachersArr.value = result.items
	}
	// 否则调用基本获取课程的接口
	else {
		getTeachers();
	}
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
	Object.assign(newTeacher.value, result)
	newTeacher.value.username = newTeacher.value.name
}

// 确认修改按钮回调
const onEdit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			// 真不是我想这样写，接口那里一个名字有name和username两个字段，人都被搞混了，反正现在这样能正常用
			newTeacher.value.name = newTeacher.value.username
			// 发起修改请求
			let result = await reqEditTeacher(newTeacher.value)
			if (result.code == 200) {
				ElMessage.success("修改成功")
			} else {
				ElMessage.error("修改失败")
			}
			// 清空教师对象
			clearObj()
			// 修改成功重新获取教师信息
			getTeachers()
			// 关闭修改标志
			editFlag.value = false
			// 返回表格界面
			isAdd.value = false
		} else {
			ElMessage.error("请完善表单")
			console.log('error submit!', fields)
		}
	})
}

// 添加教师按钮回调
const addTeacherBtn = () => {
	isAdd.value = true
	editFlag.value = false
}

// 确认添加按钮回调
const onSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (valid) {
			// 为啥后端接口里同一个意思要整两个字段啊aaaaaaa
			newTeacher.value.name = newTeacher.value.username
			newTeacher.value.userpic = newTeacher.value.pic
			// 返回课程列表
			isAdd.value = false;
			// 成功提醒
			ElMessage.success("添加成功")
			// 发起添加用户请求
			reqAddTeacher(newTeacher.value);
			getTeachers();
			isAdd.value = false
		} else {
			ElMessage.error("请完善表单")
			console.log('error submit!', fields)
		}
	})

}

// 上传教师图片两个钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	if (response == '1') {
		ElMessage.success("上传成功")
	}
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.type !== 'image/jpeg') {
		ElMessage.error('必须上传图片格式!')
		return false
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('图片大小不能超过2MB!')
		return false
	}
	return true
}

// 自定义upload的事件覆盖el-upload的action
const uploadPic = async (param: any) => {

	// 创建FormData对象，用于将文件对象包装成表单数据
	const formData = new FormData()
	formData.append('file', param.file)
	let result = await reqUploadFile(formData)

	// 调用onSuccess钩子，传入响应式数据
	param.onSuccess(result.code, param.file)

	// 上传后从远程服务器要文件地址进行赋值
	newTeacher.value.userpic = result.data
	newTeacher.value.pic = result.data

}

// 查询教师详情回调
const searchTeacher = async (id: number) => {
	let result = await reqGetTeacherByID(id)
	console.log(result);
	teacherInfo.value = result
	teacherInfoFlag.value = true
}

// 取消按钮回调
const cancel = () => {
	isAdd.value = false
	clearObj()
}

// 点击查询按钮回调
const btnInquire = async () => {
	// 开启按条件查询课程标志
	isConditonFlag.value = true
	// 先获取当前条件下的课程总数
	let result = await reqGetTeacherByName(keyWords.value, pageNo.value, pageSize.value)
	total.value = result.data.counts
	// 然后发分页请求
	pageNo.value = 1
	result = await reqGetTeacherByName(keyWords.value, pageNo.value, pageSize.value)
	teachersArr.value = result.data.items
}

// 清空文本框触发回调
const handleClear = async () => {
	isConditonFlag.value = false
	pageNo.value = 1
	await getTeachers();
}



</script>


<style scoped lang="scss">
.table-avatar {
	height: 60px;
	width: 60px;
}


.teacherinfo {
	position: absolute;
	left: 50%; //起始是在body中，横向距左50%的位置
	top: 50%; //起始是在body中，纵向距上50%的位置，这个点相当于body的中心点，div的左上角的定位
	transform: translate(-50%, -50%); //水平、垂直都居中,也可以写成下面的方式
	width: 100%;
	background-color: rgba($color: #000000, $alpha: 0.3);
	height: 100%;
	z-index: 9;

	.el-card {
		position: relative;
		left: 50%; //起始是在body中，横向距左50%的位置
		top: 50%; //起始是在body中，纵向距上50%的位置，这个点相当于body的中心点，div的左上角的定位
		transform: translate(-50%, -50%); //水平、垂直都居中,也可以写成下面的方式
		width: 60%;
		height: 70%;
	}


}

.el-table {
	::v-deep(thead .el-table__cell) {
		background-color: rgb(64, 158, 255);
		color: #eee;
	}
}

.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
	// background-color: #bcf;
}

.demo-image__error .demonstration {
	display: block;
	color: var(--el-text-color-secondary);
	font-size: 14px;
	margin-bottom: 20px;
}

.demo-image__error .el-image {
	padding: 0 5px;
	max-width: 300px;
	max-height: 200px;
	min-width: 200px;
	width: 100%;
	height: 200px;
}

.demo-image__error .image-slot {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background: var(--el-fill-color-light);
	color: var(--el-text-color-secondary);
	font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
	font-size: 30px;
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
