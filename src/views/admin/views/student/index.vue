<template>
	<!-- 展示学生列表以及操作 -->
	<div v-if="!isAdd" class="teacher-table">
		<!-- 搜索框 -->
		<el-input placeholder="输入学生姓名" :suffix-icon="Search" style="width: 200px ;" v-model="keyWords" />
		<!-- 学生查询按钮 -->
		<el-button type="primary" @click="btnInquire" style="margin: 10px 0px 10px 10px">查询</el-button>
		<!-- 添加学生按钮 -->
		<el-button type="primary" size="default" @click="addTeacherBtn" style="margin: 10px;">添加学生</el-button>
		<!-- 导出学生信息 -->
		<el-button type="primary" size="default" @click="outputBtn" style="margin: 10px;">导出</el-button>
		<!-- 展示学生列表 -->
		<el-table :data="studentsArr" border style="width: 100%" max-height="75vh " stripe :show-overflow-tooltip="true">
			<el-table-column label="序号" type="index" algin="center" width="100" align="center"></el-table-column>
			<el-table-column prop="id" label="编号" width="100" align="center" />
			<el-table-column prop="name" label="姓名" width="120" align="center" />
			<el-table-column prop="grade" label="年级" width="120" align="center" />
			<el-table-column prop="sex" label="用户性别" width="100" align="center">
				<template #="{ row }">
					<span v-if="row.sex == 1">男</span>
					<span v-else>女</span>
				</template>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" align="center" width="280" />
			<el-table-column prop="address" label="住址" align="center" width="180"/>
			<el-table-column prop="cellphone" label="电话号码" width="200" align="center">
			</el-table-column>
			<el-table-column prop="userpic" label="证件照" width="150" align="center">
				<template #="{ row }">
					<img v-if="row.userpic" class="table-avatar" :src="row.userpic" alt="图片地址失效" />
					<span v-else>暂无学生照片</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200" align="center" fixed="right">
				<template #="{ row }">
					<el-button type="primary" size="small" @click="editTeacher(row.id)" icon="Edit" title="修改学生"></el-button>
					<el-button type="primary" size="small" @click="searchTeacher(row.id)" icon="Search" title="查看学生详情"></el-button>
					<el-popconfirm title="确认删除吗?" @confirm="removeTeacher(row.id)">
						<template #reference>
							<el-button type="danger" size="small" icon="Delete" title="删除学生"></el-button>
						</template>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页器 -->
		<div class="demo-pagination-block" style="margin: 10px 0;">
			<el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 40]"
				:background="true" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
				@current-change="handleCurrentChange" />
		</div>
	</div>

	<!-- 添加学生界面 -->
	<div v-if="isAdd" class="add-container">
		<el-form :model="newStudent" ref="ruleFormRef" label-width="120px" :inline="false" style="max-width: 460px"
			:rules="rules">
			<el-form-item label="学生姓名：" prop="name">
				<el-input v-model="newStudent.name"></el-input>
			</el-form-item>
			<el-form-item label="学生电话：" prop="cellphone">
				<el-input v-model="newStudent.cellphone"></el-input>
			</el-form-item>
			<el-form-item label="学生性别：" prop="sex">
				<el-radio-group v-model="newStudent.sex">
					<el-radio label="1">男</el-radio>
					<el-radio label="0">女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="学生年级：">
				<el-input v-model="newStudent.grade" />
			</el-form-item>
			<el-form-item label="学生邮箱：">
				<el-input v-model="newStudent.email" />
			</el-form-item>
			<el-form-item label="学生住址：">
				<el-input v-model="newStudent.address" />
			</el-form-item>
			<el-form-item label="学生照片：">
				<el-upload class="avatar-uploader" :http-request="uploadPic" :show-file-list="false"
					:on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
					<img v-if="newStudent.userpic" class="avatar" :src="newStudent.userpic" />
					<el-icon v-else class="avatar-uploader-icon">
						<Plus />
					</el-icon>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button v-if="editFlag" type="primary" @click="onEdit(ruleFormRef)">修改</el-button>
				<el-button v-else type="primary" @click="onSubmit">新增</el-button>
				<el-button @click="cancel">取消</el-button>
			</el-form-item>
		</el-form>

	</div>

	<!-- 学生详细界面卡片 -->
	<div class="studentInfo" v-if="studentInfoFlag" @click="studentInfoFlag = false">
		<el-card shadow="always" :body-style="{ padding: '20px' }" @click.stop="studentInfoFlag = true">
			<template #header>
				<div class="card-header">
					<span>学生详情</span>
				</div>
			</template>
			<el-form :model="studentInfo" ref="form" label-width="100px" :inline="false" style="max-width: 460px"
				label-position="left">
				<el-form-item label="学生名称：">
					<el-input v-model="studentInfo.name"></el-input>
				</el-form-item>
				<el-form-item label="学生编号：">
					<el-input v-model="studentInfo.grade"></el-input>
				</el-form-item>
				<el-form-item label="学生邮箱：">
					<el-input v-model="studentInfo.email"></el-input>
				</el-form-item>
				<el-form-item label="学生住址：">
					<el-input v-model="studentInfo.address"></el-input>
				</el-form-item>
				<el-form-item label="学生照片：" class="demo-image__error">
					<div class="block">
						<el-image :src="studentInfo.userpic">
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
import { onMounted, reactive, ref } from 'vue';
// 获取学生相关接口
import { reqAddTeacher } from '@/api/teacher'
// 获取学生相关接口
import { reqGetStudentList, reqDeleteStudent, reqUpdateStudent, reqGetStudentInfoById, reqOutputstudent } from '@/api/student'
// 获取上传文件接口
import { reqUploadFile } from '@/api/common'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import type { UploadProps, } from 'element-plus'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import axios from "axios";
// 当前页码
let pageNo = ref(1)
// 页码大小
let pageSize = ref(10)
// 学生总数量
let total = ref(0)
// 是否点击添加学生
let isAdd = ref(false)
// 存储学生列表
let studentsArr = ref([])
// 搜索框关键字
let keyWords = ref('')
// 查询学生详细信息的标志
let studentInfoFlag = ref(false)
// 表单对象
let newStudent = ref({
	"address": "",
	"cellphone": "",
	"grade": "",
	"name": "",
	"sex": "",
	"userpic": "",
	"email": "",

})
// 绑定表单校验对象
const ruleFormRef = ref<FormInstance>()
// 学生详细信息
let studentInfo = ref({
	"address": "string",
	"cellphone": "string",
	"grade": "string",
	"name": "string",
	"sex": "string",
	"userpic": "string",
	"email": ""
})
// 表单校验规则
const rules = reactive({
	name: [{ required: true, message: "请输入学生姓名", trigger: 'blur' }],
	sex: [{ required: true, message: "请选择学生性别", trigger: 'blur' }],
	cellphone: [{ required: true, message: "请填写学生电话", trigger: 'blur' }],
})

// 定义标志判断是修改还是新增
let editFlag = ref(false)

// 封装获取学生信息方法
const getStudents = async () => {
	let result = await reqGetStudentList(pageNo.value, pageSize.value)
	studentsArr.value = result.data.items

	total.value = result.data.counts
}
// 封装一个清空对象属性值方法
const clearObj = () => {
	newStudent.value = {
		"address": "",
		"cellphone": "",
		"grade": "",
		"name": "",
		"sex": "",
		"userpic": "",
		"email": "",

	}
}
// 组件挂载时获取学生信息
onMounted(() => {
	getStudents()

})

// 删除按钮回调
const removeTeacher = async (id: number) => {
	// 调用删除接口
	let result = await reqDeleteStudent(id)
	if (result.code == 200) {
		ElMessage.success("删除成功")
		// 重新获取学生信息
		getStudents()
	}


}

// 当前页面改变触发回调
const handleCurrentChange = () => {
	// 重新发请求获取学生信息
	getStudents()
}

// 页面大小改变触发回调
const handleSizeChange = () => {
	// 重新发请求获取学生信息
	getStudents()
}

// 修改学生按钮回调
const editTeacher = async (id: number) => {
	// 打开修改标志
	editFlag.value = true
	// 获取该id对应学生信息
	let result = await reqGetStudentInfoById(id)
	// 跳转到表单页面
	isAdd.value = true
	// 学生信息添加到表单
	Object.assign(newStudent.value, result)
}

// 确认修改按钮回调
const onEdit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async (valid, fields) => {
		if (valid) {
			// 发起修改请求
			let result = await reqUpdateStudent(newStudent.value)
			if (result.code == 200) {
				ElMessage.success("修改成功")
			} else {
				ElMessage.error("修改失败")
			}
			// 清空用户对象
			clearObj()
			// 修改成功重新获取学生信息
			getStudents()
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

// 添加学生按钮回调
const addTeacherBtn = () => {
	ElMessageBox.alert(`请使用"用户管理"添加功能进行学生添加`, '提示', {
		// if you want to disable its autofocus
		// autofocus: false,
		confirmButtonText: '我知道了',
		callback: () => {
			ElMessage({
				type: 'info',
				message: `请前往用户管理进行添加`,
			})
		},
	})
}

// 确认添加按钮回调
const onSubmit = async () => {

	// 为啥后端接口里同一个意思要整两个字段啊aaaaaaa
	newStudent.value.name = newStudent.value.username
	newStudent.value.userpic = newStudent.value.pic

	// 发起添加学生请求
	let result = await reqAddTeacher(newStudent.value)
	if (result.code == 200) {
		ElMessage.success("添加成功")
	} else {
		ElMessage.error("添加失败")
	}
	// 清空学生对象
	clearObj()
	// 重新获取学生列表
	getStudents()
	// 返回学生列表
	isAdd.value = false
}

// 上传学生图片两个钩子
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
	newStudent.value.userpic = result.data
}

// 查询学生详情回调
const searchTeacher = async (id: number) => {
	let result = await reqGetStudentInfoById(id)
	studentInfo.value = result
	studentInfoFlag.value = true
}

// 取消按钮回调
const cancel = () => {
	isAdd.value = false
	clearObj()
}

// 查询按钮回调（未完成）
const btnInquire = () => {

}

// 导出学生信息按钮回调
const outputBtn = async () => {
	axios({
		method: 'post',
		url: 'http://82.157.136.14:8081/student/export',
		responseType: 'blob' // 设置响应类型为 Blob
	})
		.then(response => {
			try {
				let fileName = 'outputFile.xlsx'; // 默认文件名

				// 创建 Blob 对象和下载链接
				const blob = new Blob([response.data], { type: ' application/vnd.ms-excel;charset=utf-8 ' });

				const blobUrl = window.URL.createObjectURL(blob);
				const downloadLink = document.createElement('a');

				// 设置下载链接的属性
				downloadLink.href = blobUrl;
				downloadLink.download = fileName;

				// 触发下载
				downloadLink.click();

				// 释放 Blob URL，防止内存泄漏
				window.URL.revokeObjectURL(blobUrl);
			} catch (error) {
				console.error(error);
			}
		})
		.catch(error => {
			console.error(error);
		});

}

</script>


<style scoped lang="scss">
.table-avatar {
	height: 60px;
	width: 60px;


}

.el-table {
	::v-deep(thead .el-table__cell) {
		background-color: rgb(64, 158, 255);
		color: #eee;
	}
}

.studentInfo {
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
